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
    const jobs = await prisma.jobs.findMany({
      where: {
        job_user_id: parseInt(id),
      },
      select:{
        job_id: true,
        job_title: true,
        job_location_city: true,
        job_location_state: true,
        job_additionalCare: true, // Corrected field name
        job_date: true,
        job_time: true,
        job_duration: true,
        job_status: true,
        job_payment: true,
        lookup_jobs_job_location_stateTolookup: true, // Lookup for job location state
        lookup_jobs_job_additionalCareTolookup: true, // Lookup for job stay-in status
        category: {
            select: {
                name: true,
            },
        },
      },
    });
      
      const user = await prisma.user.findFirst({
          where: {
              userID: parseInt(id),
          },
      });

      const result = await prisma.jobs_user_assignation.findMany({
          where: {
              jobUser_userID: parseInt(id),
              jobUser_jobStatus: 72, // Filter by job status == 72
              jobUser_paymentStatus: 92, // Filter by payment status == 92
          },
          include: {
              jobs: {
                  select: {
                      job_payment: true, // We only need to sum the payment field
                  },
              },
          },
      });

       
      const total= await prisma.jobs.aggregate({
          _sum: {
              job_payment: true, // Specify that you want to sum the job_payment field
          },
          where: {
            job_user_id: parseInt(id),
          }
      });
      
      const totalPayment = total._sum.job_payment || 0;

      return {
          response: 200,
          success: true,
          data: { jobs, user, totalPayment},
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
