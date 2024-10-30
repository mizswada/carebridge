export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userID, email, roles } = event.context.user;
    let activity_user_id;
 
    if(roles.includes('Superadmin') || roles.includes('Admin')) {
      activity_user_id=body?.user_id;
    }
    else
    {
      const user = await prisma.user.findFirst({
          where: {
            userEmail: userStore.username
          }
      });
      activity_user_id=user.userID;
    }
    
    try {
        // create activities
        const createActivities = await prisma.activity.create({
            data: {
                activity_user_id:parseInt(activity_user_id),
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