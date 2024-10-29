export default defineEventHandler(async (event) => {
    try {
        // Check if an authorization header exists
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "No token provided or invalid token format",
            };
        }

        // Clear the access token cookie
        event.res.setHeader("Set-Cookie", "accessToken=; HttpOnly; Path=/; Max-Age=0");

        return {
            statusCode: 200,
            message: "Logged out successfully",
        };
    } catch (error) {
        console.error("Logout error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please try again later.",
        }; 
    }
});
