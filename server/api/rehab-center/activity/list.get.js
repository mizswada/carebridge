export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);

    try {
        // Fetch activities and their associated activity_status from lookup table
        const activities = await prisma.activity.findMany({
            where: {
                activity_user_id: parseInt(id),
                deleted_at: null,
            },
            select: {
                activity_id: true,       // Select other activity fields
                activity_id: true,
                activity_title: true,
                activity_image:true,
                activity_content: true,
                activity_media_url: true,
                activity_status: true,   // Assuming activity_status is the foreign key to lookup table
                created_at:true,
                lookup: {
                    select: {
                        lookupValue: true, // Select the activity status from lookup
                    }
                }
            }
        });

        const user = await prisma.user.findFirst({
            where: {
                userID: parseInt(id)
            }
        });

        return {
            response: 200,
            success: true,
            data: {
                user,
                activities: activities.map(activity => ({
                    activity_id: activity.activity_id,
                    activity_title: activity.activity_title,
                    activity_image:activity.activity_image,
                    activity_content: activity.activity_content,
                    activity_media_url: activity.activity_media_url,
                    activity_status: activity.lookup.lookupValue, // Return the status from lookup
                    created_at:activity.created_at
                })),
            },
        };
    } catch (error) {
        console.error("Error fetching activities:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch activities",
        };
    }
});
