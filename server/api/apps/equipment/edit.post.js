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

        // Helper function to save Base64 image to the server
        const saveBase64File = async (base64Data, uploadDir) => {
            const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error("Invalid base64 string format.");
            }
            const mimeType = matches[1];
            const fileExtension = mimeType.split("/")[1];
            const base64ImageData = base64Data.replace(/^data:image\/\w+;base64,/, "");
            const fileBuffer = Buffer.from(base64ImageData, "base64");
            const uniqueFilename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileUploadPath = path.join(uploadDir, uniqueFilename);
            await fs.promises.writeFile(fileUploadPath, fileBuffer);
            return `/uploads/${path.basename(uploadDir)}/${uniqueFilename}`;
        };

        // Helper function to remove the old image
        const removeOldFile = async (filePath) => {
            const absolutePath = path.join(process.cwd(), 'public', filePath);
            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath); // Remove the old image from the server
            }
        };

        // Parse the request body
        const body = await readBody(event);

        // Find the existing equipment
        const existingEquipment = await prisma.equipment.findUnique({
            where: {
                equipment_id: parseInt(body.id), // Assuming `equipment_id` is passed in the request
                equipment_user_id: parseInt(userID),
            },
        });

        if (!existingEquipment) {
            return {
                statusCode: 404,
                message: "Equipment not found",
            };
        }

        // Initialize new image path
        let imagePath = existingEquipment.equipment_image;

        // If a new image is uploaded, save it and remove the old one
        if (body.image) {
            const newImagePath = await saveBase64File(body.image, path.join("/home/carebridge/", 'public/uploads/equipment_images'));

            // Remove the old image if it exists
            if (existingEquipment.equipment_image) {
                await removeOldFile(existingEquipment.equipment_image);
            }

            imagePath = newImagePath;
        }

        const parsedRent_sdate = body.rent_sdate
            ? DateTime.fromFormat(body.rent_sdate, 'dd-MM-yyyy').toJSDate()
            : null;

        const parsedRent_edate = body.rent_edate
          ? DateTime.fromFormat(body.rent_edate, 'dd-MM-yyyy').toJSDate()
          : null;

        // Update the equipment details
        const updatedEquipment = await prisma.equipment.update({
            where: {
                equipment_id: parseInt(body.id),
            },
            data: {
                equipment_image: imagePath,
                equipment_name: body.name,
                equipment_description: body.description,
                equipment_type: body.type ? parseInt(body.type) : existingEquipment.equipment_type,
                equipment_price: body.price ? parseFloat(body.price) : existingEquipment.equipment_price,
                equipment_rent_type: body.rent_type ? parseInt(body.rent_type) : existingEquipment.equipment_rent_type,
                equipment_rent_period: body.rent_period ? parseInt(body.rent_period) : existingEquipment.equipment_rent_period,
                equipment_rent_sdate: body.rent_sdate ? parsedRent_sdate : existingEquipment.equipment_rent_sdate,
                equipment_rent_edate: body.rent_edate ? parsedRent_edate : existingEquipment.equipment_rent_edate,
                equipment_pic_name: body.pic_name || existingEquipment.equipment_pic_name,
                equipment_pic_phoneNum: body.pic_phoneNum || existingEquipment.equipment_pic_phoneNum,
                equipment_status: body.status ? parseInt(body.status) : existingEquipment.equipment_status,
            },
        });

        if (!updatedEquipment) {
            return {
                statusCode: 400,
                message: "Failed to update equipment. Please check your data and try again.",
            };
        }

        return {
            statusCode: 200,
            message: "Equipment updated successfully",
            data: updatedEquipment
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
