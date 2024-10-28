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
                jobs_user_assignation: {
                    some: {
                        jobUser_userID: userID, // Filter by assigned user
                    }
                },
            },
            /* where: {
                job_status: "ACTIVE",
            }, */
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

                lookup_jobs_job_durationTolookup: {
                    select: {
                        lookupID: true,
                        lookupValue: true
                    }
                },
            },
        });
        
        // Map through the data to flatten nested objects into a more frontend-friendly structure
        const flattenedJobs = getJob.map(job => ({
            job_id: job.job_id,
            job_category: job.category?.name,
            job_title: job.job_title,
            job_location_city: job.job_location_city,
            job_location_state: job.lookup_jobs_job_location_stateTolookup?.lookupValue,
            job_date: job.job_date,
            job_time: job.job_time,
            job_duration: job.lookup_jobs_job_durationTolookup?.lookupValue,
            job_payment: job.job_payment,
            job_notes: job.job_notes,
            job_additionalCare: job.lookup_jobs_job_additionalCareTolookup?.lookupValue,
            job_caretaker_type: job.lookup_jobs_job_caretaker_typeTolookup?.lookupValue,
            job_status: job.job_status,
            
            // Flattened category fields
            /* category_id: job.category?.category_id,
            category_name: job.category?.name,
            
            // Flattened job location state lookup fields
            location_state_id: job.lookup_jobs_job_location_stateTolookup?.lookupID,
            location_state_name: job.lookup_jobs_job_location_stateTolookup?.lookupValue,
            
            // Flattened additional care lookup fields
            additional_care_id: job.lookup_jobs_job_additionalCareTolookup?.lookupID,
            additional_care_name: job.lookup_jobs_job_additionalCareTolookup?.lookupValue */
        }));
        
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
  