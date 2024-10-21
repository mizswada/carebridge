export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // Delete activity
        const deleteActivity = await prisma.activity.updateMany({
            where: {
                activity_id: parseInt(body?.id),
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