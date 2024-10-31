import jwt from 'jsonwebtoken';
import sendOneSignalNotification from '@/server/helper/oneSignal';


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

        console.log("Request body:", body); // Debugging log

        // Check if the user has already accepted this job
        const existingAssignment = await prisma.jobs_user_assignation.findFirst({
            where: {
                jobUser_userID: userID,
                jobUser_jobID: parseInt(body.job_id)
            }
        });

        if (existingAssignment) {
            return {
                statusCode: 400,
                message: "You have already accepted this job."
            };
        }

        const getStatus = await prisma.lookup.findFirst({
            where: {
                lookupID: 195,
            },
            select: {
                lookupID: true,
                lookupValue: true,
            },
        });

        const newJob = await prisma.jobs.update({
            where: {
                job_id: parseInt(body.job_id),
            },
            data: {
                job_status: getStatus.lookupValue.toUpperCase()
            },
        });

        const assignJob = await prisma.jobs_user_assignation.create({
            data: {
                jobUser_userID: parseInt(userID),
                jobUser_jobID: parseInt(body.job_id),
                jobUser_jobStatus: parseInt(getStatus.lookupID)
            },
        });  

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to accept job. Please check your data and try again.",
            };
        } 

        //get job
        const getJob = await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(body.job_id),
            },
            select: {
                job_user_id: true,
                job_title: true
            },
        });

        // Send push notification if job is successfully assigned
        //await sendOneSignalNotification(getJob.job_user_id, getJob.job_title);
        await sendOneSignalNotification(
            getJob.job_user_id,
            "Job Accepted",
            `Your job "${getJob.jobTitle}" has been accepted.`
        );
    
        return {
            statusCode: 200,
            message: "Job successfully accepted",
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
            message: "Something went wrong! Please contact your administrator.",
        };
    }
});
  
