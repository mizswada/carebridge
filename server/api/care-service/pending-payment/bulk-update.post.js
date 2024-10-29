export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);
    const { ids, status } = body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return {
        response: 400,
        message: "Invalid input. Please provide valid IDs and a status.",
      };
    }

   
    // Perform bulk update with updateMany
    const updateResult = await prisma.jobs_user_assignation.updateMany({
      where: {
        jobUser_id: {
          in: ids,
        },
      },
      data: {
        jobUser_paymentStatus: status,  // Ensure this matches the actual column name in your database
        jobUser_paymentDate:new Date(),         

      },
    });

    // Check if any records were updated
    if (updateResult.count === 0) {
      return {
        response: 404,
        message: "No records found to update.",
      };
    }

    return {
      response: 200,
      message: `${updateResult.count} records successfully updated.`,
    };
  } catch (error) {
    console.error("Bulk update error:", error);
    return {
      response: 500,
      message: "An error occurred while updating records. Please try again.",
    };
  }
});
