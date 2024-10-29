export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
      // Update category
      const updateJob = await prisma.jobs_user_assignation.updateMany({
        where: {
            jobUser_id: parseInt(body?.id),
        },
        data: {
            jobUser_paymentStatus: parseInt(body?.status) ,
            jobUser_paymentTransactionNum: body?.refNum, 
            jobUser_paymentDate:new Date(),         
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
  