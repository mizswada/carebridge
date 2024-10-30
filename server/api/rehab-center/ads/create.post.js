export default defineEventHandler(async (event) => {
    const body = await readBody(event); // Get body of the request
    const { userID, email, roles } = event.context.user;
    let user_id;

    try {
        // Check user role
        if(roles.includes('Superadmin') || roles.includes('Admin')) {
            user_id = body?.user_id;  // Admin or Superadmin sets the user_id from the request body
        } else {
            // Regular user, fetch user info from database using username from store
            const user = await prisma.user.findFirst({
                where: {
                    userEmail: userStore.username
                }
            });

            // Handle case where user is not found
            if (!user) {
                return {
                    response: 404,
                    message: "User not found",
                };
            }

            user_id = user.userID;
        }
        
        // Create a new advertising entry in the database
        const createEquipment = await prisma.advertising.create({
            data: {
                advertising_user_id: parseInt(user_id),
                advertising_image: body?.imageInput,
                advertising_media_url: body?.urlInput,
                advertising_status: parseInt(body?.statusInput),
                created_at: new Date(),  // Optionally use this, if it's not already handled by default
            },
        });

        // Return success response
        return {
            response: 200,
            message: "Successfully created the advertising",
            data: createEquipment,
        };
    } 
    catch (error) {
        // Log the error and return a failure response
        console.error("Error creating advertising:", error);

        return {
            response: 500,
            message: "Error creating advertising",
            error: error.message,
        };
    }
});
