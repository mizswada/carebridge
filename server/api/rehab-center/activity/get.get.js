export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        const details = await prisma.activity.findUnique({
            where: {
                activity_id: parseInt(id),
                deleted_at: null
            }
        });

        return {
            response: 200,
            success: true,
            data: details,
        };
    } catch (error) {
        console.error("Error fetching activity details:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch activity details",
        };
    }
});
