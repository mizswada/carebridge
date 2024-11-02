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

        // Retrieve the start time of the new job
        const getJob = await prisma.jobs.findFirst({
            where: { job_id: body.job_id },
            select: { 
                job_user_id: true,
                job_title: true,
                job_date: true, 
                job_time: true,
                job_duration: true, 
            },
        });

        if (!getJob ) {
            return {
                statusCode: 400,
                message: "Job not found.",
            };
        }

        // Check for conflicts with a 1-hour buffer after current job end time
        const hasConflict = await checkJobConflict(userID, getJob.job_date, getJob.job_time, getJob.job_duration, 1);

        if (hasConflict) {
            return {
                statusCode: 400,
                message: "You have a conflicting job within 1 hour of this job's end time.",
            };
        }

        const updatedJob = await prisma.jobs.update({
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

        // Send push notification if job is successfully assigned
        await sendOneSignalNotification(
            getJob.job_user_id,
            "Job Accepted",
            `Your job "${getJob.jobTitle}" has been accepted.`
        );
    
        return {
            statusCode: 200,
            message: "Job successfully accepted",
            data: updatedJob
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

// Function to check for job conflicts based on new conditions
async function checkJobConflict(userID, jobDate, jobTime, jobDuration, bufferHours) {
    // Calculate the start time of the new job
    const newJobStart = DateTime.fromJSDate(jobDate).set({
        hour: jobTime.getHours(),
        minute: jobTime.getMinutes(),
    });

    // Check for existing jobs with the same start time and date
    const sameTimeJob = await prisma.jobs_user_assignation.findFirst({
        where: {
            jobUser_userID: userID,
            jobs: {
                job_date: jobDate,
                job_time: jobTime,
            },
            jobUser_jobStatus: {
                notIn: [201, 200], 
            },
        },
    });

    if (sameTimeJob) {
        return true; // Conflict due to identical start time
    }

    // Calculate the end time for the new job (job time + job duration + 1-hour buffer)
    const newJobEnd = newJobStart.plus({ hours: jobDuration + bufferHours });

    // Find any existing jobs that overlap with the new job's end time
    const conflictingJob = await prisma.jobs_user_assignation.findFirst({
        where: {
            jobUser_userID: userID,
            jobs: {
                job_date: jobDate,
                job_time: {
                    lt: newJobEnd.toJSDate(),
                },
            },
            jobUser_jobStatus: 195, // Adjust to your accepted status ID
        },
    });
    console.log("newJobEnd: ",newJobEnd);
    console.log("conflictingJob: ",conflictingJob);

    return !!conflictingJob; // Returns true if there’s a conflict, otherwise false
}
  
