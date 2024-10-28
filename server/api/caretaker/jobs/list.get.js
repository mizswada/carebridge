export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);
  
    // Check if userId exists
    if (!id) { 
      return {
        response: 500,
        success: false,
        error: "User Id is missing",
      };
    }
  
    // Fetch jobs for the specific user
    try {
        const jobs = await prisma.jobs_user_assignation.findMany({
        where: {
            jobUser_userID: parseInt(id),
        },
        include: {
            jobs: {
            select: {
                job_id: true,
                job_title: true,
                job_location_city: true,
                job_location_state: true,
                job_stayin: true,
                job_date: true,
                job_time: true,
                job_duration: true,
                job_payment: true,
                job_status: true,
                job_payment:true,
                // Include lookup for job_location_state and job_stayin
                lookup_jobs_job_location_stateTolookup: true, // Lookup for job location state
                lookup_jobs_job_stayinTolookup: true, // Lookup for job stay-in status
                category: {
                select: {
                    name: true,
                },
                },
            },
            },
            lookup_jobs_user_assignation_jobUser_jobStatusTolookup: true, // Include job status lookup
            lookup_jobs_user_assignation_jobUser_paymentStatusTolookup: true, // Include payment status lookup
        },
        });

        const user = await prisma.user.findFirst({
            where: {
                userID: parseInt(id)
            }
        });

        const result = await prisma.jobs_user_assignation.findMany({
            where: {
                jobUser_userID: parseInt(id),
                jobUser_jobStatus: 72,        // Filter by job status == 72
                jobUser_paymentStatus: 92,    // Filter by payment status == 92
            },
            include: {
              jobs: {
                select: {
                  job_payment: true, // We only need to sum the payment field
                },
              },
            },
          });
      
          // Calculate the sum of job payments manually
          const totalPayment = result.reduce((acc, assignation) => {
            return acc + (assignation.jobs.job_payment || 0);
          }, 0);
  
        return {
            response: 200,
            success: true,
            data: { jobs,user,totalPayment },
        };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return {
        response: 500,
        success: false,
        error: "Failed to fetch data",
      };
    }
  });
  