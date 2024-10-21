import { DateTime } from "luxon";

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

    const parsedJobDate = body.job_date ? new Date(body.job_date) : null;
    const parsedJobTime = body.job_time
      ? DateTime.fromISO(`1970-01-01T${body.job_time}`).toJSDate()
      : null;
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
        job_date: parsedJobDate,
        job_time: parsedJobTime,
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
