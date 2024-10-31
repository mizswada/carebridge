import sendOneSignalNotification from '@/server/helper/oneSignal';
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
        const email = decodedToken.userEmail;
    
        // Read the body of the request to get user data
        const body = await readBody(event);
        const jobID = body.jobUser_id; // value dari job_id.job

        console.log("Request body:", body); // Debugging log

        const assignJob = await prisma.jobs_user_assignation.updateMany({
            where: {
                jobUser_jobID: parseInt(jobID),
            },
            data: {
                jobUser_rating: body.rating,
            },
        });

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to submit the rating. Please check your data and try again.",
            };
        }

        const getJob = await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(jobID),
            },
            select: {
                job_user_id: true,
                job_title: true,
                job_payment: true,
                jobs_user_assignation: {
                    select: {
                        jobUser_userID: true
                    }
                }
            },
        });

        // Notification content for notifying caretaker of received rating
        await sendOneSignalNotification(
            getJob.jobs_user_assignation[0].jobUser_userID,  // Use the caretaker's user ID
            "You've Received a Rating!",
            `Your client has rated you. Check your profile to view the feedback and rating. Thank you for your hard work!`
        );


        return {
            statusCode: 200,
            message: "Rating submitted successfully! Thank you for your feedback."
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
  