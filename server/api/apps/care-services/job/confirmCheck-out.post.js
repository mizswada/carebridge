import { DateTime } from "luxon";
import jwt from 'jsonwebtoken';import mail from "@/server/helper/email";
import sendOneSignalNotification from '@/server/helper/oneSignal';
import paymentReminderTemplate from "@/server/template/email/payment-Reminder";


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

        const updateAmtPayment = await prisma.jobs_user_assignation.update({
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
                message: "Failed to verify the check out. Please check your data and try again.",
            };
        }

        //send notification
        await sendOneSignalNotification(
            assignJob.jobUser_userID,
            "Check-out Confirmed",
            `Your checkout for the job "${updateJob.job_title}" has been confirmed, and the job is now marked as complete. Thank you for your hard work. Your payment will be released soon.`
        );

        // Send email reminder to admin    
        const getSetting = await prisma.setting.findFirst({
            where: {
                setting_name: "email",
                status: "ACTIVE"
            },
            select: {
                setting_value: true,
            },
        });

        const getCareTaker = await prisma.jobs_user_assignation.findFirst({
            where: {
                jobUser_id: parseInt(body.jobUser_id),
            },
            select: {
                user: {
                    select: {
                        userFullName: true
                    }
                },
                jobUser_paymentAmount: true,
                jobs: {  // Access related job fields through the `jobs` relation
                    select: {
                        job_id: true,
                        job_title: true,
                    },
                },
            },
        });

        let data = {
            jobID: getCareTaker.jobs.job_id,
            jobTitle: getCareTaker.jobs.job_title,
            amtDue: getCareTaker.jobUser_paymentAmount,
            careTakerName: getCareTaker.user.userFullName
        };
      
        console.log("Data: ");
        console.log(data);

        //send email to remain admin make payment to caretaker
       const emailTemplate = replaceEmailTemplateWord(paymentReminderTemplate, data);

        await mail(
            getSetting.setting_value,
            "Payment Reminder for Caretaker",
            "Payment Reminder for Caretaker",
            emailTemplate
        ); 

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
  

function replaceEmailTemplateWord(template, data) {
    let emailTemplate = template;
  
    Object.keys(data).forEach((key) => {
      emailTemplate = emailTemplate.replace(`[[${key}]]`, data[key]);
    });
  
    return emailTemplate;
}