export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // Delete equipment
        const deleteEquipment = await prisma.advertising.updateMany({
            where: {
                advertising_id: parseInt(body?.id),
            },
            data: {
                deleted_at: new Date(),
            },
        });
  
        return {
            response: 200,
            message: "Successfully Delete the data",
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