export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    try {
      // Update category
      const updateJob = await prisma.jobs.updateMany({
        where: {
            job_id: parseInt(body?.id),
        },
        data: {
            job_paymentStatus: body?.status ,
            job_paymentReferenceNum: body?.refNum,          
        },
      });
  
      return {
        response: 200,
        message: "Successfully update the data",
        data: updateJob,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });
  