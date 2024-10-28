export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        const details = await prisma.equipment.findUnique({
            where: {
                equipment_id: parseInt(id),
                deleted_at: null
            }
        });

        return {
            response: 200,
            success: true,
            data: details,
        };
    } catch (error) {
        console.error("Error fetching equipment details:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch equipment details",
        };
    }
});
