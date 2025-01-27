import jwt from 'jsonwebtoken';
import { DateTime } from "luxon";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        // Decode token to get the role and user ID
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or invalid",
              };
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.auth.secretAccess);
        
        const userID = decodedToken.userID;
    
        // Read the body of the request to get user data
        const body = await readBody(event);

        const updateUser = await prisma.user.update({
            where: {
                userID: parseInt(userID),
            },
            data: {
                userStatus: "DELETED",
                userModifiedDate: DateTime.now().toJSDate(),
            },
        });

         // Clear the access token cookie
         event.res.setHeader("Set-Cookie", "accessToken=; HttpOnly; Path=/; Max-Age=0");

        return {
            statusCode: 200,
            message: "User account successfully deleted",
        };
  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 400,
                message: "Your session has expired. Please log in again.",
            };
        }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            //message: "Something went wrong! Please contact your administrator.",
            message: error.message
        };
    }
  });
  