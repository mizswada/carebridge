export default defineEventHandler(async (event) => {
    const { id } = getQuery(event); // Assuming `id` is passed as a query parameter
  
    if (!id) {
      return {
        response: 400,
        success: false,
        error: "Job ID is missing",
      };
    }
  
    try {
        const job= await prisma.jobs.findFirst({
            where: {
                job_id: parseInt(id),
            },
            select: {
                job_id: true,
                job_user_id:true,
                job_title: true,
                job_duration: true,
                job_additionalCare: true,
                job_status:true,
                job_payment:true,
                category:true,
                lookup_jobs_job_additionalCareTolookup:true,
                lookup_jobs_job_location_stateTolookup:true,
                job_location_city:true,
                job_notes:true,
                job_date:true
            },
        });

        const jobDetailCount= await prisma.jobs_user_assignation.count({
            where: {
                jobUser_jobID: parseInt(id),
            },
        });

        const careservice = await prisma.user.findFirst({
          where: {
            userID: parseInt(job.job_user_id), // Filter by user ID
          },
          select: {
            userID: true,
            userFullName: true,
            userEmail: true,
            userPhone: true,
            user_client: {
              select: {
                addressLine1: true, // Select fields from user_client
                addressLine2: true,
                postcode: true,
                city: true,
                // Include lookup for state
                lookup_user_client_stateTolookup: true,
                // Include lookup for country
                lookup_user_client_countryTolookup:true
              },
            },
          },
        });

        let jobDetail;
        let caretaker;
        if(jobDetailCount >0 )
        {
          jobDetail= await prisma.jobs_user_assignation.findFirst({
                where: {
                    jobUser_jobID: parseInt(id),
                },
            });

          caretaker = await prisma.user.findFirst({
              where: {
                userID: parseInt(jobDetail.jobUser_userID), // Filter by user ID
              },
              select: {
                userID: true,
                userFullName: true,
                userEmail: true,
                userPhone: true,
                user_care_taker: {
                  select: {
                      address_line_1: true, // Select fields from user_client
                      address_line_2: true,
                      address_postcode: true,
                      address_city: true,
                    // Include lookup for state
                    lookup_user_care_taker_address_stateTolookup:true,                  
                  },
                },
              },
          });
        }

        return {
            response: 200,
            success: true,
            data: {
                job, 
                jobDetailCount,
                jobDetail,
                careservice,
                caretaker
            },
        };

      // Fetch job details along with user and caretaker (if applicable)
      const jobDetails = await prisma.jobs.findFirst({
        where: {
          job_id: parseInt(id),
        },
        include: {
          // Include job details
          category: {
            select: {
              name: true, // Category name
            },
          },
          lookup_jobs_job_location_stateTolookup: true, // State lookup
          lookup_jobs_job_additionalCareTolookup: true, // Additional care lookup
  
          // Include user (job_user_id refers to the user who posted the job)
          user: {
            select: {
              userID: true,
              userFullName: true,
              userEmail: true,
              userPhone: true,
            },
          },
  
          // Include caretaker details from jobs_user_assignation
          jobs_user_assignation: {
            select: {
              jobUser_id: true,
              jobUser_userID: true, // User ID of the caretaker
              jobUser_jobStatus: true,
              jobUser_paymentStatus: true,
              jobUser_rating: true,
  
              // Nested inclusion for caretaker details (assuming user model for caretaker)
              user: {
                select: {
                  userID: true,
                  userFullName: true,
                    userEmail: true,
                    userPhone: true,
                },
              },
            },
          },
        },
      });
  
      // If no job is found
      if (!jobDetails) {
        return {
          response: 404,
          success: false,
          error: "Job not found",
        };
      }
  
      return {
        response: 200,
        success: true,
        data: jobDetails,
      };
    } catch (error) {
      console.error("Error fetching job details:", error);
      return {
        response: 500,
        success: false,
        error: "Failed to fetch job details",
      };
    }
  });
  