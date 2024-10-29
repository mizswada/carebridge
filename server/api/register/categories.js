// /server/api/categories.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Query the category table to get the category_id and name
    const categories = await prisma.category.findMany({
      select: {
        category_id: true,
        type: true,
        name: true,
      },
    });

    // Format the data for the dropdown options
    const formattedCategories = categories.map((category) => ({
      value: category.category_id,
      type: category.type,
      label: category.name,
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
