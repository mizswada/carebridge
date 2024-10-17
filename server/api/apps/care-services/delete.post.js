import { DateTime } from "luxon";
import jwt from 'jsonwebtoken';


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
        const roles = decodedToken.roles;
    
        // Read the body of the request to get user data
        const body = await readBody(event);

        console.log("Request body:", body); // Debugging log

        const newJob = await prisma.jobs.update({
            where: {
                job_id: parseInt(body.id),
            },
            data: {
                job_status: "DELETED",
                deleted_at: new Date(),
            },
        });

        if(!newJob) {
            return {
                statusCode: 400,
                message: "Failed to delete job. Please check your data and try again.",
            };
        }

        return {
            statusCode: 200,
            message: "Job deleted successfully",
        };
  
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  