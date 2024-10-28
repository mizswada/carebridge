export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // Delete category
        const deleteCategory = await prisma.user.update({
            where: {
                userID: parseInt(body?.id),
            },
            data: {
                userStatus:'DELETED',
                userModifiedDate: new Date(),
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