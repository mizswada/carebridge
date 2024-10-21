export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        // Fetch user where type is 'rehab_center'
        const details = await prisma.user_rehab_center.findFirst({
            where: {
                user_id: parseInt(id),
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                userID: parseInt(id),
            }
        });

        const activityCount = await prisma.activity.count({
            where: {
                activity_user_id: parseInt(id),
                deleted_at: null,
            },
        });

        const equipmentCount = await prisma.equipment.count({
            where: {
                equipment_user_id: parseInt(id),
                deleted_at: null,
            },
        });

        return {
            response: 200,
            success: true,
            data: {user,details,activityCount,equipmentCount}
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch user details",
        };
    }
});
