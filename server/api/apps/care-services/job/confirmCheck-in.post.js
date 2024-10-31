import { DateTime } from "luxon";
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
        const email = decodedToken.userEmail;
    
        // Read the body of the request to get user data
        const body = await readBody(event);

        console.log("Request body:", body); // Debugging log
        const jobID = body.jobUser_id; // value dari job_id.job

        //const parsedCheckIn = body.checkIn ? new Date(body.checkIn) : null;
        const parsedCheckIn = body.checkIn
            ? DateTime.fromFormat(body.checkIn, 'dd-MM-yyyy HH:mm:ss').toJSDate()
            : null;

        if (!parsedCheckIn || isNaN(parsedCheckIn.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid date format. Expected format is 'dd-MM-yyyy HH:mm:ss'.",
            };
        }

        const getStatus = await prisma.lookup.findFirst({
            where: {
                lookupID: 197,
            },
            select: {
                lookupID: true,
                lookupValue: true,
            },
        });

        const assignJob = await prisma.jobs_user_assignation.updateMany({
            where: {
                jobUser_jobID: parseInt(jobID),
            },
            data: {
                jobUser_confirmCheckIN: parsedCheckIn,
                jobUser_jobStatus: parseInt(getStatus.lookupID)
            },
        });

        const updateJob = await prisma.jobs.update({
            where: {
                job_id: parseInt(jobID),
            },
            data: {
                job_status: getStatus.lookupValue.toUpperCase()
            },
        });

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to verify the check in. Please check your data and try again.",
            };
        }

        const getJob = await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(jobID),
            },
            select: {
                job_user_id: true,
                job_title: true,
                jobs_user_assignation: {
                    select: {
                        jobUser_userID: true
                    }
                }
            },
        });

        console.log("getJob: ", getJob);

        //send notification
        await sendOneSignalNotification(
            getJob.jobs_user_assignation[0].jobUser_userID,
            "Check-in Confirmed",
            `Your check-in for the job "${getJob.job_title}" has been confirmed by the client.`,
        );

        return {
            statusCode: 200,
            message: "Check-in confirmed! You have successfully verified the caretaker's check-in for the job.",
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
