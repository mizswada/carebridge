import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    try {
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or invalid",
            };
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.auth.secretAccess); // Replace with your secret key
        const userID = decodedToken.userID;

        const body = await readBody(event);

        // Helper function to save Base64 image to the server
        const saveBase64File = async (base64Data, uploadDir) => {


          // Extract the mimeType and base64 string using a regex
          const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
          
          if (!matches || matches.length !== 3) {
              throw new Error("Invalid base64 string format.");
          }

          // Get the file extension
          const mimeType = matches[1]; // E.g., image/png
          const fileExtension = mimeType.split("/")[1]; // E.g., png

          // Strip off the Base64 part and decode the data
          const base64ImageData = base64Data.replace(/^data:image\/\w+;base64,/, "");
          const fileBuffer = Buffer.from(base64ImageData, "base64");

          // Create a unique filename with the extension
          const uniqueFilename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
          
          // Ensure the directory exists
          if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Full file path
          const fileUploadPath = path.join(uploadDir, uniqueFilename);

          // Write the file to the server
          await fs.promises.writeFile(fileUploadPath, fileBuffer);

          // Return the file path
          return `/uploads/${path.basename(uploadDir)}/${uniqueFilename}`;
        };

        // Initialize response data
        let imagePath;

        // Process profile_picture if provided
        if (body.image) {
          const equipmentPath = await saveBase64File(body.image, path.join(process.cwd(), 'public/uploads/equipment_images'));
          imagePath = equipmentPath;
        }

        const parsedRent_sdate = body.rent_sdate
            ? DateTime.fromFormat(body.rent_sdate, 'dd-MM-yyyy').toJSDate()
            : null;

        const parsedRent_edate = body.rent_edate
          ? DateTime.fromFormat(body.rent_edate, 'dd-MM-yyyy').toJSDate()
          : null;

        // Create new equipment
        const newEquipment = await prisma.equipment.create({
          data: {
              equipment_user_id: parseInt(userID),
              equipment_image: imagePath,
              equipment_name: body.name,
              equipment_description: body.description,
              equipment_type: parseInt(body.type),
              equipment_price: parseFloat(body.price),
              equipment_rent_type: body.rent_type ? parseInt(body.rent_type) : null,
              equipment_rent_period: body.rent_period ? parseInt(body.rent_period) : null,
              equipment_rent_sdate: parsedRent_sdate,
              equipment_rent_edate: parsedRent_edate,
              equipment_pic_name: body.pic_name,
              equipment_pic_phoneNum: body.pic_phoneNum,
              equipment_status: 112
          },
        });

        if (!newEquipment) {
            return {
                statusCode: 400,
                message: "Failed to create equipment. Please check your data and try again.",
            };
        }

        return {
            statusCode: 200,
            message: "Equipment created successfully",
            data: newEquipment
        };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
          return {
              statusCode: 400,
              message: "Your session has expired. Please log in again.",
          };
      }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
});
