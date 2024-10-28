export default defineEventHandler(async (event) => {
  try {
    // Fetch all jobs and include related category and lookup for job_location_state
    const allJobs = await prisma.jobs.findMany({
      include: {
        user:{
          select:{
            userFullName:true,
            userEmail:true
          }
        },
        category: {  // Include related job category from the category table
          select: {
            name: true, // Assuming "categoryTitle" is the column that holds the category name
          },
        },
        lookup_jobs_job_location_stateTolookup: { // Include related state from lookup table
          select: {
            lookupValue: true, // Assuming "lookupValue" is the column that holds the state name
          },
        },
      },
    });

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
