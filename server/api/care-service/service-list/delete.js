export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Check if the job exists
    const job = await prisma.jobs.findUnique({
      where: {
        job_id: body.job_id,
      },
    });

    if (!job) {
      return {
        statusCode: 404,
        message: "Job not found",
      };
    }

    // Delete the job
    await prisma.jobs.delete({
      where: {
        job_id: body.job_id,
      },
    });

    return {
      statusCode: 200,
      message: "Job successfully deleted!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
