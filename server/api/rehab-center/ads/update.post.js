export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // Update advertising
        const updateEquipment = await prisma.advertising.updateMany({
            where: {
                advertising_id: parseInt(body?.advertisingID),
            },
            data: {
                
                advertising_image:body?.imageInput,
                advertising_media_url:body?.urlInput,
                advertising_status:parseInt(body?.statusInput),
                updated_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateEquipment,
        };
    } 
    catch (error) 
    {
        console.error("Error update advertising details:", error);
        return {
            statusCode: 500,
            message: error.message,
        };
    }
  });