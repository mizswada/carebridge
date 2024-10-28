import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
    // Parse the form data
    const body = await readBody(event);
   
    try {
        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                userUsername: body?.userUsername,
            }
        });
       
        if (existingUser) {
            return {
                response: 409, // Conflict
                success: false,
                error: "Username already exists"
            };
        } 
        else{
            return {
                response: 200,
                success: true,
                message: "Username can used"
            };
        }
        
    }
    catch (error) 
    {
        console.error("Error creating rehab center:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to create rehab center"
        };
    }
});
