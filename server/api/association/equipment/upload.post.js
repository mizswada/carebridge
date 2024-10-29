import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // console.log(body);

    const imageData = body.base64Data.replace(/^data:image\/\w+;base64,/, "");
    const file = Buffer.from(imageData, "base64");

    // Create the path to save the file
    const dir = path.join(process.cwd(), 'public/uploads/association/equipment');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const uniqueFilename = Date.now() + "_" + Math.floor(Math.random() * 1000);
    const fileName = uniqueFilename + "_"+ body.fileName;
    // Specify the path where you want to save the file
    const fileUpload = path.join(process.cwd(), `public/uploads/association/equipment/${fileName}`);
    //const fileUpload = `/home/ascii/ALSB/public/img/uploads/${body.operationID}/${fileName}`;
    const filePath = `/uploads/association/equipment/${fileName}`;

    await fs.promises.writeFile(fileUpload, file);

    return {
      respond: 200,
      message: "File uploaded successfully!",
      data: {
        fileName: fileName,
        filePath: filePath,
      },
    };
  } catch (error) {
    return {
      respond: 500,
      message: "Error saving the file",
      error: error.message,
    };
  }
});