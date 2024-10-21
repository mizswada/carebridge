export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        // Fetch user where type is 'admin'
        const details = await prisma.user_admin.findFirst({
            where: {
                admin_user_id: parseInt(id),
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                userID: parseInt(id),
            }
        });       

        return {
            response: 200,
            success: true,
            data: {user,details}
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
