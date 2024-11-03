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

            console.log("File uploaded successfully:", fileUploadPath);

            // Return the file path
            return {
                fileName: uniqueFilename,
                fileUploadPath: fileUploadPath,
                
              };

            
        };

        // Initialize response data
        let imagePath;

        // Process profile_picture if provided
        if (body.image) {
            const equipmentPath = await saveBase64File(body.image, path.join("/home/carebridge/", 'public/uploads/equipment_images'));
            imagePath = equipmentPath;
        }


        return {
            statusCode: 200,
            message: "Equipment created successfully",
            data: equipmentPath
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
            //message: "Something went wrong! Please contact your administrator.",
            message:  error.message,
        };
    }
});
