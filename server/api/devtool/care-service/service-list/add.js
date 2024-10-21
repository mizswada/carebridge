import { DateTime } from "luxon";

const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const allJobs = await prisma.jobs.findMany();
    const jobExist = allJobs.some(
      (job) =>
        job.job_title.toLowerCase() === body.job_title.toLowerCase() &&
        job.job_location_city.toLowerCase() ===
          body.job_location_city.toLowerCase()
    );

    // if (jobExist) {
    //   return { statusCode: 400, message: "Job already exists" };
    // }
    const parsedJobDate = body.job_date ? new Date(body.job_date) : null;
    const parsedJobTime = body.job_time
      ? DateTime.fromISO(`1970-01-01T${body.job_time}`).toJSDate()
      : null;
      
    const jobData = {
      job_category: body.job_category,
      job_title: body.job_title,
      job_location_city: body.job_location_city,
      job_location_state: body.job_location_state,
      // job_date: new Date(body.job_date), // Store as DateTime with full ISO string
      job_date: parsedJobDate,
      job_time: parsedJobTime,
      // job_time: body.job_time, // Store as String in HH:mm format
      job_duration: body.job_duration,
      job_payment: parseFloat(body.job_payment),
      job_notes: body.job_notes || "",
      job_stayin: body.job_stayin,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const job = await prisma.jobs.create({ data: jobData });

    return job
      ? { statusCode: 200, message: "Job successfully added!" }
      : { statusCode: 500, message: "Something went wrong!" };
  } catch (error) {
    return { statusCode: 500, message: error.message };
  }
});
