import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Fetch both states and countries from the lookup table
    const lookups = await prisma.lookup.findMany({
      where: {
        lookupTitle: { in: ["state", "country"] }, // Filter for both types
      },
      select: {
        lookupID: true,
        lookupValue: true,
        lookupTitle: true, // Assuming you have a `type` column to differentiate
      },
    });

    // Separate states and countries based on the type
    const states = lookups
      .filter((item) => item.lookupTitle === "state")
      .map((state) => ({ value: state.lookupID, label: state.lookupValue }));

    const countries = lookups
      .filter((item) => item.lookupTitle === "country")
      .map((country) => ({
        value: country.lookupID,
        label: country.lookupValue,
      }));

    return {
      success: true,
      data: {
        states,
        countries,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to retrieve lookup data",
      error: error.message,
    };
  }
});
