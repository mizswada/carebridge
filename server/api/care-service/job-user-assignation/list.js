import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Fetch all jobs_user_assignation records
    const allAssignments = await prisma.jobs_user_assignation.findMany();

    return {
      statusCode: 200,
      data: allAssignments,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
