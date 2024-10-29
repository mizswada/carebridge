export default defineEventHandler(async (event) => {
    try {
      // Fetch all jobs from the jobs table using Prisma
      const jobs = await prisma.jobs.findMany({
        // where: {
        //     type: "care_service",
        //     deleted_at: null,
        // },
        select:{
            job_id:true,
            job_user_id:true,
            job_title:true,
            job_payment:true,
            job_paymentStatus:true,
            job_paymentReferenceNum:true,
            user:true
        }
      });

      const totalPayment = await prisma.jobs.aggregate({
        _sum: {
          job_payment: true,
        },
      });
  
      // Return the job data as JSON
      return {
        response: 200,
        success: true,
        data: {
                jobs,
                totalPayment: totalPayment._sum.job_payment || 0,
            }
        };
      
    } catch (error) {
      // Error handling
        console.error("Error fetching jobs:", error);
        return {
        response: 500,
        success: false,
        error: "Failed to fetch jobs",
        };      
    }
  });
  