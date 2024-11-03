import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
        const body = await readBody(event);

        const base64Data = body.image;
        const uploadDir = `/home/carebridge/public/img/uploads/equipment_images`;

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
        const filePath = `/uploads/${path.basename(uploadDir)}/${uniqueFilename}`;

        return {
        statusCode: 200,
        message: "File uploaded successfully!",
        data: {
            fileName: uniqueFilename,
            filePath: filePath,
        },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error saving the file",
      error: error.message,
    };
  }
});
