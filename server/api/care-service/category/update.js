export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // return {
  //     response: 200,
  //     success: true,
  //     data: body,
  // };
  try {
    // Update category
    const updateCategory = await prisma.category.updateMany({
      where: {
        category_id: parseInt(body?.id),
      },
      data: {
        name: body?.name,
        description: body?.description,
        charges:body?.charges,        
        charges_pro:body?.proCharges,        
        status: body?.status,
      },
    });

    return {
      response: 200,
      message: "Successfully update the data",
      data: updateCategory,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
