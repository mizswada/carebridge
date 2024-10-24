import jwt from 'jsonwebtoken';
import axios from 'axios';

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

        //await registerUserInOneSignal(getJob.job_user_id, )

        //await sendOneSignalNotification(getJob.job_user_id, getJob.job_title);
        

        if(!assignJob) {
            return {
                statusCode: 400,
                message: "Failed to accept job. Please check your data and try again.",
            };
        } 

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

// Function to send push notification via OneSignal
async function sendOneSignalNotification(userID, jobTitle) {
    try {
        const notificationData = {
            app_id: config.oneSignal.appId, // OneSignal App ID from runtime config
            include_external_user_ids: [userID.toString()], // Targeting by external user ID (your own system user ID)
            headings: { "en": "Job Accepted" },
            contents: { "en": `Your job "${jobTitle}" has been accepted.` },
            url: `https://your-app-url.com/job/${userID}`, // Link to the job or other URL in your system
        };

        const response = await axios.post('https://onesignal.com/api/v1/notifications', notificationData, {
            headers: {
                Authorization: `Basic ${config.oneSignal.restApiKey}`, // OneSignal REST API Key
                'Content-Type': 'application/json',
            },
        });

        console.log('Notification sent:', response.data);
    } catch (error) {
        if (error.response && error.response.data.errors) {
            console.error('Notification error:', error.response.data.errors); // Log specific errors
        } else {
            console.error('Error sending notification:', error.response?.data || error.message);
        }
    }
}

// Function to register a user via OneSignal API
async function registerUserInOneSignal(userID, deviceType = 1, deviceToken) {
    try {
        // Prepare the data for OneSignal player creation
        const registrationData = {
            app_id: config.oneSignal.appId, // Your OneSignal App ID
            device_type: deviceType, // 1 for iOS, 2 for Android, 5 for Web Push
            external_user_id: userID, // Your system's user ID
            identifier: deviceToken, // Device token or ID from the user's device (e.g., from your mobile app or web browser push)
        };

        const response = await axios.post('https://onesignal.com/api/v1/players', registrationData, {
            headers: {
                Authorization: `Basic ${config.oneSignal.restApiKey}`, // Your OneSignal REST API Key
                'Content-Type': 'application/json',
            },
        });

        console.log('User registered in OneSignal:', response.data);
        return response.data; // Return the player ID or any response data if needed
    } catch (error) {
        console.error('Error registering user in OneSignal:', error.response?.data || error.message);
        throw error;
    }
}
  
