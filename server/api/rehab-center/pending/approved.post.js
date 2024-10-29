export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // approved
        const approved = await prisma.user.update({
            where: {
                userID: parseInt(body?.id),
            },
            data: {
                userStatus:'ACTIVE',
                userModifiedDate: new Date(),
            },
        });
  
        return {
            response: 200,
            message: "Successfully approved the data",
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