export default defineEventHandler(async (event) => {
  try {
    // Fetch all jobs
    const allJobs = await prisma.jobs.findMany();

    return {
      statusCode: 200,
      data: allJobs,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
