export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // Update activity
        const updateActivity = await prisma.activity.updateMany({
            where: {
                activity_id: parseInt(body?.activityID),
            },
            data: {
                activity_title: body?.titleInput ,
                activity_image: body?.imageInput ,
                activity_content: body?.descriptionInput,
                activity_media_url:body?.urlInput,
                activity_status:body?.statusInput,
                updated_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateActivity,
        };
    } 
    catch (error) 
    {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });