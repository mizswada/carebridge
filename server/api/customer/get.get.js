export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        // Fetch user where type is 'admin'
        const details = await prisma.user_client.findFirst({
            where: {
                user_id: parseInt(id),
            }
        });

        const adminCount = await prisma.user_client.count({
            where: {
                user_id: parseInt(id), // Ensure `id` is parsed to an integer
            },
        });

        const emergencyCount = await prisma.emergency_contacts.count({
            where: {
                contact_user_id	: parseInt(id), // Ensure `id` is parsed to an integer
                deleted_at: null,
            },
        });
 
        const equipmentCount = await prisma.equipment.count({
            where: {
                equipment_user_id	: parseInt(id), // Ensure `id` is parsed to an integer
                deleted_at: null,
            },
        });

        const jobCount = await prisma.jobs.count({
            where: {
                job_user_id	: parseInt(id), // Ensure `id` is parsed to an integer
                deleted_at: null,
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
            data: {user,details,adminCount,emergencyCount,equipmentCount,jobCount}
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
