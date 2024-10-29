// /server/api/lookup.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Fetch states, countries, and association types from the lookup table
    const lookups = await prisma.lookup.findMany({
      where: {
        lookupTitle: { in: ["state", "country", "Association Type"] }, // Include "Association Type" here
      },
      select: {
        lookupID: true,
        lookupValue: true,
        lookupTitle: true,
      },
    });

    // Separate data based on lookupTitle
    const states = lookups
      .filter((item) => item.lookupTitle === "state")
      .map((state) => ({ value: state.lookupID, label: state.lookupValue }));

    const countries = lookups
      .filter((item) => item.lookupTitle === "country")
      .map((country) => ({
        value: country.lookupID,
        label: country.lookupValue,
      }));

    const associationTypes = lookups
      .filter((item) => item.lookupTitle === "Association Type")
      .map((type) => ({
        value: type.lookupID,
        label: type.lookupValue,
      }));

    return {
      success: true,
      data: {
        states,
        countries,
        associationTypes,
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
