export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        
        const adminCount = await prisma.user_care_taker.count({
            where: {
                user_id: parseInt(id), // Ensure `id` is parsed to an integer
            },
        });
        // Fetch user where type is 'admin'
        const details = await prisma.user_care_taker.findFirst({
            where: {
                user_id: parseInt(id),
            }
        });

        const jobs = await prisma.jobs_user_assignation.findMany({
            where: {
                jobUser_userID: parseInt(id),
            },
        });
       

        const equipmentCount = await prisma.equipment.count({
            where: {
                equipment_user_id	: parseInt(id), // Ensure `id` is parsed to an integer
            },
        });

        const user = await prisma.user.findUnique({
            where: {
                userID: parseInt(id),
            }
        });       

        return {
            response: 200,
            success: true,
            data: {user,adminCount,equipmentCount,details,jobs}
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
