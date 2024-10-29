// server/api/rehab-center/category.get.js
export default defineEventHandler(async (event) => {
    try {
        // Fetch categories where type is 'rehab_center' and deleted_at is null
        const categories = await prisma.category.findMany({
            where: {
                type: 'rehab_center',
                deleted_at: null // Optional: Only fetch active (not deleted) categories
            }
        });

        return {
            response: 200,
            success: true,
            data: categories
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch categories"
        };
    }
});
