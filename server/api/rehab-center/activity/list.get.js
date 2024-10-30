export default defineEventHandler(async (event) => {
    const { userID, email, roles } = event.context.user;
    const { id } = getQuery(event); 

    let user;

    try { 
        // Fetch user based on role (Admin/Superadmin or others)
        if(roles.includes('Superadmin') || roles.includes('Admin')) {
            user = await prisma.user.findFirst({
                where: {
                    userID: parseInt(id)
                }
            });
        } else {
            user = await prisma.user.findFirst({
                where: {
                    userEmail: id
                }
            });
        }

        // If user is not found, return early
        if (!user) {
            return {
                response: 404,
                success: false,
                error: "User not found"
            };
        }

        // Fetch activities and their associated activity_status from lookup table
        const activities = await prisma.activity.findMany({
            where: {
                activity_user_id: user.userID,
                deleted_at: null,
            },
            select: {
                activity_id: true,
                activity_title: true,
                activity_image: true,
                activity_content: true,
                activity_media_url: true,
                activity_status: true,  // Assuming activity_status is a foreign key to the lookup table
                created_at: true,
                lookup: {
                    select: {
                        lookupValue: true,  // Assuming "lookupValue" is the status field in lookup
                    }
                }
            }
        });

        // Return both user and activities data
        return {
            response: 200,
            success: true,
            data: {
                user,
                activities: activities.map(activity => ({
                    activity_id: activity.activity_id,
                    activity_title: activity.activity_title,
                    activity_image: activity.activity_image,
                    activity_content: activity.activity_content,
                    activity_media_url: activity.activity_media_url,
                    activity_status: activity.lookup.lookupValue,  // Extract status from lookup relation
                    created_at: activity.created_at
                }))
            }
        };
    } catch (error) {
        console.error("Error fetching activities:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch activities"
        };
    }
});
