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

        //const parsedCheckIn = body.checkIn ? new Date(body.checkIn) : null;
        const parsedCheckIn = body.checkIn
            ? DateTime.fromFormat(body.checkIn, 'dd-MM-yyyy HH:mm:ss').toJSDate()
            : null;

        if (!parsedCheckIn || isNaN(parsedCheckIn.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid date format. Expected format is 'dd-MM-yyyy'.",
            };
        }

        const getStatus = await prisma.lookup.findFirst({
            where: {
                lookupID: 196,
            },
            select: {
                lookupID: true,
                lookupValue: true,
            },
        });

        const assignJob = await prisma.jobs_user_assignation.update({
            where: {
                jobUser_id: parseInt(body.jobUser_id),
            },
            data: {
                jobUser_checkIN: parsedCheckIn,
                jobUser_jobStatus: parseInt(getStatus.lookupID)
            },
        });

        console.log(getStatus);
        const updateJob = await prisma.jobs.update({
            where: {
                job_id: parseInt(assignJob.jobUser_jobID),
            },
            data: {
                job_status: getStatus.lookupValue.toUpperCase()
            },
        });

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to checkin. Please check your data and try again.",
            };
        }

        //get job
        const getJob = await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(updateJob.job_id),
            },
            select: {
                job_user_id: true,
                job_title: true
            },
        });

        console.log("Notify to: ",getJob.job_user_id);
        //send notification
        await sendOneSignalNotification(
            getJob.job_user_id,
            "Caretaker Check-in",
            `Please confirm the check-in for the caretaker assigned to your job "${getJob.job_title}".`,
        );

        return {
            statusCode: 200,
            message: "You have successfully checked in for the job.",
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
  