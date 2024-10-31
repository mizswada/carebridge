import mail from "@/server/helper/email";
import resetPasswordTemplate from "@/server/template/email/reset-Password";
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
                jobUser_complain: body.complaint,
            },
        });

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to submit the complaint. Please try again.",
            };
        }

        return {
            statusCode: 200,
            message: "Your complaint has been submitted successfully. We will review it as soon as possible."
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
  