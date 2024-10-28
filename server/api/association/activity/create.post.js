import { useUserStore } from "~/stores/user";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userStore = useUserStore()
    const userRole = useUserStore().roles[0];  // Get user role
    let user_id;
    try {  
      if (userRole === 'Admin' || userRole === 'Superadmin') {
        user_id=body?.user_id;
      }
      else
      {
        const user = await prisma.user.findFirst({
            where: {
              userEmail: userStore.username
            }
        });
        user_id=user.userID;
      }
        // create activities
        const createActivities = await prisma.activity.create({
            data: {
                activity_user_id:parseInt(user_id),
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