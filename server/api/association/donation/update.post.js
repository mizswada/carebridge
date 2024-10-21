export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // Update donation
        const updateDonation = await prisma.donation.updateMany({
            where: {
                donation_id: parseInt(body?.id),
            },
            data: {
                donation_status: body?.status
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateDonation,
        };
    } 
    catch (error) 
    {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });