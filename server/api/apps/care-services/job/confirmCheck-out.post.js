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
        const jobID = body.jobUser_id; // value dari job_id.job

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

        //update to confirm checkout
        const assignJob = await prisma.jobs_user_assignation.updateMany({
            where: {
                jobUser_jobID: parseInt(jobID),
            },
            data: {
                jobUser_confirmCheckOut: parsedCheckOut,
                jobUser_paymentAmount: getJob.job_payment - 2,
                jobUser_jobStatus: getStatus.lookupID,        // Use the foreign key ID directly
                jobUser_paymentStatus: 228 
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
                message: "Failed to verify the check out. Please check your data and try again.",
            };
        }

        //send notification
        await sendOneSignalNotification(
            getJob.jobs_user_assignation[0].jobUser_userID,
            "Check-out Confirmed",
            `Your checkout for the job "${getJob.job_title}" has been confirmed, and the job is now marked as complete. Thank you for your hard work. Your payment will be released soon.`
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
                jobUser_jobID: parseInt(body.jobUser_id),
            },
            select: {
                user: {
                    select: {
                        userFullName: true
                    }
                },
                jobUser_paymentAmount: true,
            },
        });

        console.log(getCareTaker)
        let data = {
            jobID: updateJob.job_id,
            jobTitle: updateJob.job_title,
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
            //message: "Something went wrong! Please contact your administrator.",
            message: error.message,
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