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
                job_additionalCare: true,
                job_status: true,
                job_caretaker_type: true,
                jobs_user_assignation: {
                    select: {
                        jobUser_id: true,
                        user: {
                            select: {
                                userFullName: true,
                                userEmail: true
                            },
                        },
                        jobUser_checkIN: true,
                        jobUser_checkOut: true,
                    }
                }
            },
        });

        if(!getJob) {
            return {
                statusCode: 400,
                message: "Data not found",
            };
        }

        // Format job_date and job_time
        const formattedJobDate = getJob.job_date
            ? DateTime.fromJSDate(getJob.job_date).setZone("Asia/Kuala_Lumpur").toFormat("dd MMM yyyy")
            : null;
        const formattedJobTime = getJob.job_time
            ? DateTime.fromJSDate(getJob.job_time).setZone("Asia/Kuala_Lumpur").toFormat("hh:mm a")
            : null;

        return {
            statusCode: 200,
            message: "Job retrieved successfully",
            data: {
                ...getJob,
                job_date: formattedJobDate,
                job_time: formattedJobTime,
            }
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
  