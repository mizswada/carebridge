export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Ensure job_id is provided
  if (!body.job_id) {
    return {
      statusCode: 400,
      message: "Job ID is required",
    };
  }

  try {
    // Find the job if it already exists
    const job = await prisma.jobs.findUnique({
      where: {
        job_id: body.job_id,
      },
    });

    if (!job) {
      // Return 404 if the job is not found
      return {
        statusCode: 404,
        message: "Job not found",
      };
    }

    // Parse and validate date and time inputs
    const jobDate = body.job_date ? new Date(body.job_date) : null;
    let jobTime = null;
    if (body.job_time) {
      const [hours, minutes] = body.job_time.split(":").map(Number);
      if (jobDate && !isNaN(hours) && !isNaN(minutes)) {
        jobTime = new Date(jobDate);
        jobTime.setHours(hours, minutes, 0, 0); // Set time on jobTime object
        jobTime = jobTime.toISOString(); // Convert to ISO-8601 format
      } else {
        return {
          statusCode: 400,
          message: "Invalid date or time format.",
        };
      }
    }
    // Update the job according to the job_id and provided values
    const updatedJob = await prisma.jobs.update({
      where: {
        job_id: body.job_id,
      },
      data: {
        job_category: body.job_category,
        job_title: body.job_title,
        job_location_city: body.job_location_city,
        job_location_state: body.job_location_state,
        job_date: jobDate,
        job_time: jobTime,
        job_duration: body.job_duration,
        job_payment: body.job_payment,
        job_notes: body.job_notes || "",
        job_stayin: body.job_stayin,
        updated_at: new Date(),
      },
    });

    // Output when the job is successfully updated
    return {
      statusCode: 200,
      message: "Job successfully updated!",
      data: updatedJob,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
