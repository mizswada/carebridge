// server/api/lookup.get.js
export default defineEventHandler(async (event) => {
    try {
        // Fetch all lookup data from the database
        const lookupData = await prisma.lookup.findMany({});

        return {
            response: 200,
            success: true,
            data: lookupData
        };
    } catch (error) {
        console.error("Error fetching lookup data:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch lookup data"
        };
    }
});
