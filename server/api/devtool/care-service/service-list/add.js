export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Check if the job already exists
    const allJobs = await prisma.jobs.findMany();

    const jobExist = allJobs.find((job) => {
      return (
        job?.job_title.toLowerCase() === body?.job_title.toLowerCase() &&
        job?.job_location_city.toLowerCase() ===
          body?.job_location_city.toLowerCase()
      );
    });

    if (jobExist) {
      return {
        statusCode: 400,
        message: "Job already exists",
      };
    }

    // Parse and validate date and time inputs
    const jobDate = body.job_date ? new Date(body.job_date) : null;
    let jobTime = null;
    let jobDateTime = null; // Declare jobDateTime here
    if (body.job_time) {
      const [hours, minutes] = body.job_time.split(":").map(Number);
      if (jobDate && !isNaN(hours) && !isNaN(minutes)) {
        jobDateTime = new Date(jobDate);
        jobDateTime.setHours(hours, minutes, 0, 0); // Set time on jobDateTime object
        jobDateTime = jobDateTime.toISOString(); // Convert to ISO-8601 format
      } else {
        return {
          statusCode: 400,
          message: "Invalid date or time format",
        };
      }
    }

    // Add new job based on the provided data
    const job = await prisma.jobs.create({
      data: {
        job_category: body.job_category,
        job_title: body.job_title,
        job_location_city: body.job_location_city,
        job_location_state: body.job_location_state,
        job_date: jobDate,
        job_time: jobTime,
        job_duration: body.job_duration,
        job_payment: parseFloat(body.job_payment),
        job_notes: body.job_notes || "",
        job_stayin: body.job_stayin,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (job) {
      return {
        statusCode: 200,
        message: "Job successfully added!",
      };
    } else {
      return {
        statusCode: 500,
        message: "Something went wrong! Please contact your administrator.",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
