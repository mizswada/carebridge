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

        // Parse job_date and job_time to correct formats
        const parsedJobDate = body.job_date
            ? DateTime.fromFormat(body.job_date, 'dd-MM-yyyy').toJSDate()
            : null;

        if (!parsedJobDate || isNaN(parsedJobDate.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid job_date format. Expected format is 'dd-MM-yyyy'.",
            };
        }

        const parsedJobTime = body.job_time
            ? DateTime.fromISO(`1970-01-01T${body.job_time}`).toJSDate()
            : null;

        const newJob = await prisma.jobs.create({
            data: {
                job_user_id: parseInt(userID),
                job_category: parseInt(body.job_category),
                job_title: body.job_title,
                job_location_city: body.job_location_city,
                job_location_state: parseInt(body.job_location_state),
                job_date: parsedJobDate,
                job_time: parsedJobTime,
                job_duration: parseInt(body.job_duration),
                job_payment: parseFloat(body.job_payment),
                job_notes: body.job_notes ,
                job_additionalCare: parseInt(body.job_stayin),
                created_at: new Date(),
            },
        });

        if(!newJob) {
            return {
                statusCode: 400,
                message: "Failed to create job. Please check your data and try again.",
            };
        }

        return {
            statusCode: 200,
            message: "Job created successfully",
            data: newJob
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
            message: error.message,
        };
    }
  });
  