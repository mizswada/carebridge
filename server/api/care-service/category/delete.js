export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    // Delete category
    const deleteCategory = await prisma.category.updateMany({
      where: {
        category_id: parseInt(body?.id),
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      response: 200,
      message: "Successfully Delete the data",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
