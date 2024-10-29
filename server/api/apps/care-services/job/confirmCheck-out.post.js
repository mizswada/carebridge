import { DateTime } from "luxon";
import jwt from 'jsonwebtoken';import mail from "@/server/helper/email";
import resetPasswordTemplate from "@/server/template/email/reset-Password";


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

        //const parsedCheckOut = body.checkOt ? new Date(body.checkOt) : null;
        const parsedCheckOut = body.checkOut
            ? DateTime.fromFormat(body.checkOut, 'dd-MM-yyyy HH:mm:ss').toJSDate()
            : null;

        if (!parsedCheckOut || isNaN(parsedCheckOut.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid date format. Expected format is 'dd-MM-yyyy HH:mm:ss'.",
            };
        }

        const getStatus = await prisma.lookup.findFirst({
            where: {
                lookupID: 200,
            },
            select: {
                lookupID: true,
                lookupValue: true,
            },
        });

        console.log("getStatus:", getStatus);

        //update to confirm checkout
        const assignJob = await prisma.jobs_user_assignation.update({
            where: {
                jobUser_id: parseInt(body.jobUser_id),
            },
            data: {
                jobUser_confirmCheckOut: parsedCheckOut,
                lookup_jobs_user_assignation_jobUser_jobStatusTolookup: {
                    connect: { lookupID: getStatus.lookupID },
                },
                lookup_jobs_user_assignation_jobUser_paymentStatusTolookup: {
                    connect: { lookupID: 228 },
                },
            },
        });

        const updateJob = await prisma.jobs.update({
            where: {
                job_id: parseInt(assignJob.jobUser_jobID),
            },
            data: {
                job_status: getStatus.lookupValue.toUpperCase()
            },
        });

        const updateamtPayment = await prisma.jobs_user_assignation.update({
            where: {
                jobUser_id: parseInt(body.jobUser_id),
            },
            data: {
                jobUser_paymentAmount: updateJob.job_payment - 2
            },
        });

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to verify the check in. Please check your data and try again.",
            };
        }

        //send email
        /* const emailTemplate = replaceEmailTemplateURL(resetPasswordTemplate);

        await mail(
            email,
            "Reset Password",
            "Reset Password",
            emailTemplate
        ); */

        return {
            statusCode: 200,
            message: "Check-out confirmed! You have successfully verified the caretaker's check-out for the job.",
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
  
  function replaceEmailTemplateURL(template) {
    return template.replace();
  }