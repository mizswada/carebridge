// /server/api/categories.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Query the category table to get the necessary fields, filtered by type
    const categories = await prisma.category.findMany({
      where: {
        type: "care_service",
      },
      select: {
        category_id: true,
        name: true, // The job list name
      },
    });

    // Format the data for the dropdown options
    const formattedCategories = categories.map((category) => ({
      id: category.category_id, // Use category_id as the value
      value: category.name, // Use name as the display label for the job list
    }));

    return {
      success: true,
      data: formattedCategories,
    };
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return {
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    };
  }
});
