export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    try {
        // create activities
        const createActivities = await prisma.activity.create({
            data: {
                activity_user_id:parseInt(body?.user_id),
                activity_title: body?.titleInput ,
                activity_image: body?.imageInput ,
                activity_content: body?.descriptionInput,
                activity_media_url:body?.urlInput,
                activity_status:body?.statusInput,
                created_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully create the data",
            data: createActivities,
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