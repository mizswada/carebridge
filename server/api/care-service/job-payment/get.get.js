export default defineEventHandler(async (event) => {
    const { id } = getQuery(event); // Assuming `id` is passed as a query parameter

    try {
      // Fetch all jobs from the jobs table using Prisma
      const jobs = await prisma.jobs.findFirst({
        where: {
            job_id	: parseInt(id),
            deleted_at: null,
        },
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
  
      // Return the job data as JSON
      return {
        response: 200,
        success: true,
        data: {
                jobs,
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
  