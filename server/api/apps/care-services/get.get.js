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
        const query = getQuery(event);
        const jobId = parseInt(query.id);

        if (!jobId) {
            return {
                statusCode: 400,
                message: "Invalid or missing job ID.",
            };
        }

        const getJob = await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(jobId),
            },
            select: {
                job_category: true,
                job_title: true,
                job_location_city: true,
                job_location_state: true,
                job_date: true,
                job_time: true,
                job_duration: true,
                job_payment: true,
                job_notes: true,
                job_stayin: true,
                job_status: true
            },
        });

        if(!getJob) {
            return {
                statusCode: 400,
                message: "Data not found",
            };
        }

        return {
            statusCode: 200,
            message: "Job retrieved successfully",
            data: getJob
        };
  
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  