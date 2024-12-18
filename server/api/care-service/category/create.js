export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // create category
    const createCategory = await prisma.category.create({
      data: {
        type: "care_service",
        name: body?.name,
        description: body?.description,
        status: body?.status,
        charges:body?.charges,        
        charges_pro:body?.proCharges,        
        created_at: new Date(),
      },
    });

    return {
      response: 200,
      message: "Successfully create the data",
      data: createCategory,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
