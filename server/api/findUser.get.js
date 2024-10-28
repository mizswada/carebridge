export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);    
    try { 
        const user = await prisma.user.findFirst({
            where: {
                userEmail: id
            }
        });    
        

        return {
            response: 200,
            success: true,
            data:user.userID
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch user",
        };
    }
});
