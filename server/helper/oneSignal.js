import axios from 'axios';
const config = useRuntimeConfig();

// Function to send a dynamic push notification via OneSignal
export default async function sendOneSignalNotification(userID, headings, contents, urlPath = false) {
    try {
        // Fetch player_id for the user from your database
        const user = await prisma.user.findFirst({
            where: { userID },
            select: { player_id: true } // Ensure this field exists in your database
        });

        if (!user || !user.player_id || user.player_id == 0) {
            console.error('Player ID not found for user:', userID);
            // Log the error for additional troubleshooting
            await prisma.log.create({
                data: {
                    user_id: userID,
                    message: `Notification error for user ${userID}: Player ID not found for user`,
                    timestamp: new Date()
                }
            });
            return;
        }

        const notificationData = {
            app_id: config.oneSignal.appId,
            include_player_ids: [user.player_id],
            headings: { "en": headings },  // Dynamic headings
            contents: { "en": contents },  // Dynamic contents    
        };

        if (urlPath) {
            notificationData.url = `myapp://${urlPath}`;  // Dynamic deep link URL
        }

        const response = await axios.post(
            'https://onesignal.com/api/v1/notifications',
            notificationData,
            {
                headers: {
                    Authorization: `Basic ${config.oneSignal.restApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        ); 

        await prisma.log.create({
            data: {
                user_id: userID,
                message: `Notification sent for user ${userID}: ${response.data}`,
                timestamp: new Date()
            }
        });
      
        console.log('notificationData:', notificationData);
        console.log('Notification sent:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error.response?.data || error.message);
        // Log the error for additional troubleshooting
        await prisma.log.create({
            data: {
                user_id: userID,
                message: `Notification error for user ${userID}: ${error.message}`,
                timestamp: new Date()
            }
        });
    }
}
