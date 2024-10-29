export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        // Fetch categories where type is 'association'
        const details = await prisma.category.findUnique({
            where: {
                category_id: parseInt(id),
                deleted_at: null
            }
        });

        return {
            response: 200,
            success: true,
            data: details,
        };
    } catch (error) {
        console.error("Error fetching categories details:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch categories details",
        };
    }
});
