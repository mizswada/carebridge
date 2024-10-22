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
        const parsedCheckOut = body.checkOt
            ? DateTime.fromFormat(body.checkOt, 'dd-MM-yyyy HH:mm:ss').toJSDate()
            : null;

        if (!parsedCheckOut || isNaN(parsedCheckOut.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid date format. Expected format is 'dd-MM-yyyy'.",
            };
        }

        const assignJob = await prisma.jobs_user_assignation.update({
            where: {
                jobUser_id: parseInt(body.jobUser_id),
            },
            data: {
                jobUser_confirmCheckOut: parsedCheckOut,
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