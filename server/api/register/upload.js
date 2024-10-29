import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // Body containing the base64 file and the filename

    // Decode the base64 string to a buffer
    const imageData = body.base64Data.replace(/^data:image\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(imageData, "base64");

    // Define the directory where the file will be saved
    const dir = path.join(process.cwd(), "public/uploads/register"); // 'public/uploads' directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate a unique filename to prevent overwriting
    const uniqueFilename = Date.now() + "_" + body.filename;
    const filePath = path.join(dir, uniqueFilename);

    // Save the file to the directory
    await fs.promises.writeFile(filePath, fileBuffer);

    // Return the public path to the file
    return {
      statusCode: 200,
      data: {
        filePath: `/uploads/register/${uniqueFilename}`, // Public file path
      },
      message: "File uploaded successfully!",
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      message: "File upload failed",
      error: error.message,
    };
  }
});
