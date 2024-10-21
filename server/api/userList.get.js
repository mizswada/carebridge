// server/api/user.get.js
export default defineEventHandler(async (event) => {
    try {
        // Fetch all user data where userStatus is 'ACTIVE'
        const userData = await prisma.user.findMany({
            where: {
                userStatus: 'ACTIVE',
            },
        });

        return {
            response: 200,
            success: true,
            data: userData,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch user data",
        };
    }
});
