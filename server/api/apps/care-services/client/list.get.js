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
            /* where: {
                job_status: "ACTIVE",
            }, */
            where: {
                job_user_id: parseInt(userID),
            },
            select: {
                job_id: true,
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
                job_status: true,
                job_billcode: true,
                
                // Flattening the related category fields
                category: {
                    select: {
                        category_id: true,
                        name: true
                    }
                },
                
                // Flattening the related lookup fields for job location state
                lookup_jobs_job_location_stateTolookup: {
                    select: {
                        lookupID: true,
                        lookupValue: true
                    }
                },
                
                // Flattening the related lookup fields for additional care
                lookup_jobs_job_additionalCareTolookup: {
                    select: {
                        lookupID: true,
                        lookupValue: true
                    }
                },

                lookup_jobs_job_caretaker_typeTolookup: {
                    select: {
                        lookupID: true,
                        lookupValue: true
                    }
                },

                jobs_user_assignation: {
                    select: {
                        user: {
                            select: {
                                userFullName: true,
                                userPhone: true
                            }
                        },
                        jobUser_checkIN: true,
                        jobUser_checkOut: true,
                        jobUser_confirmCheckIN: true,
                        jobUser_confirmCheckOut: true,
                    }
                }
            },
        });
        
        // Map through the data to flatten nested objects into a more frontend-friendly structure
        const flattenedJobs = getJob.map(job => {
            const formattedJobDate = job.job_date
                ? DateTime.fromJSDate(job.job_date).setZone("Asia/Kuala_Lumpur").toFormat("dd MMM yyyy")
                : null;
            const formattedJobTime = job.job_time
                ? DateTime.fromJSDate(job.job_time).setZone("Asia/Kuala_Lumpur").toFormat("hh:mm a")
                : null;
            
            // Combine date and time if both exist
            const job_datetime = formattedJobDate && formattedJobTime
                ? `${formattedJobDate} ${formattedJobTime}`
                : null;

                // Format each assignation
            const formattedAssignations = job.jobs_user_assignation.map(assignation => ({
                userFullName: assignation.user.userFullName,
                userPhone: assignation.user.userPhone,
                checkIN: assignation.jobUser_checkIN ? DateTime.fromJSDate(assignation.jobUser_checkIN).toFormat("dd MMM yyyy hh:mm a") : null,
                checkOut: assignation.jobUser_checkOut ? DateTime.fromJSDate(assignation.jobUser_checkOut).toFormat("dd MMM yyyy hh:mm a") : null,
                confirmCheckIN: assignation.jobUser_confirmCheckIN ? DateTime.fromJSDate(assignation.jobUser_confirmCheckIN).toFormat("dd MMM yyyy hh:mm a") : null,
                confirmCheckOut: assignation.jobUser_confirmCheckOut ? DateTime.fromJSDate(assignation.jobUser_confirmCheckOut).toFormat("dd MMM yyyy hh:mm a") : null,
            }));
            
            return {
                job_id: job.job_id,
                job_category: job.category?.name,
                job_title: job.job_title,
                job_location_city: job.job_location_city,
                job_location_state: job.lookup_jobs_job_location_stateTolookup?.lookupValue,
                job_date: formattedJobDate,
                job_time: formattedJobTime,
                //job_datetime, // Combined date and time
                job_duration: job.job_duration,
                job_payment: job.job_payment,
                job_notes: job.job_notes,
                job_additionalCare: job.lookup_jobs_job_additionalCareTolookup?.lookupValue,
                job_caretaker_type: job.lookup_jobs_job_caretaker_typeTolookup?.lookupValue,
                job_status: job.job_status,
                job_billcode: job.job_status === "PENDING" ? job.job_billcode : null,
                assignations: formattedAssignations
            };
        });

        
        if (!flattenedJobs.length) {
            return {
                statusCode: 400,
                message: "Data not found",
            };
        }
        
        return {
            statusCode: 200,
            message: "Job retrieved successfully",
            data: flattenedJobs
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
  