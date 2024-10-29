// /server/api/devtool/care-service/service-list/lookup.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const { lookupTitle } = getQuery(event);

    // Query the lookup table to get the specified fields
    const lookups = await prisma.lookup.findMany({
      where: lookupTitle ? { lookupTitle } : {},
      select: {
        lookupID: true,
        lookupValue: true,
      },
    });

    // Format the data for the dropdown
    const formattedLookups = lookups.map((lookup) => ({
      id: lookup.lookupID,
      value: lookup.lookupValue,
    }));

    return {
      success: true,
      data: formattedLookups,
    };
  } catch (error) {
    console.error("Error retrieving lookups:", error);
    return {
      success: false,
      message: "Failed to retrieve lookups",
      error: error.message,
    };
  }
});
