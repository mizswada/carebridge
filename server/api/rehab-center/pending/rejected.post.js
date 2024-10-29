export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // approved
        const reject = await prisma.user.update({
            where: {
                userID: parseInt(body?.id),
            },
            data: {
                userStatus:'REJECTED',
                userModifiedDate: new Date(),
            },
        });
  
        return {
            response: 200,
            message: "Successfully reject the data",
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