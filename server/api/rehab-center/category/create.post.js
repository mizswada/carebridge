export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    try {
        // create category
        const createCategory = await prisma.category.create({
            data: {
                type:"rehab_center",
                name: body?.name ,
                description: body?.description ,
                status: body?.status,
                created_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully create the data",
            data: createCategory,
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