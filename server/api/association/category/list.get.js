export default defineEventHandler(async (event) => {
    try {
        // Fetch categories where type is 'association'
        const categories = await prisma.category.findMany({
            where: {
                type: 'association',
                deleted_at: null
            }
        });

        return {
            response: 200,
            success: true,
            data: categories,
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch categories",
        };
    }
});
