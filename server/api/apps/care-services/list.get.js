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
     
        const getJob = await prisma.jobs.findMany({
            where: {
                job_status: "ACTIVE",
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
                job_additionalCare: true,
                job_caretaker_type: true,
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
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 400,
                message: "Your session has expired. Please log in again.",
            };
        }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  