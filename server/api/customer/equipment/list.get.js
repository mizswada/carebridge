export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);

    try {
        // Fetch equipments and their associated equipment_status from lookup table
        const equipments = await prisma.equipment.findMany({
            where: {
                equipment_user_id: parseInt(id),
                deleted_at: null,
            },
            select: {
                equipment_id: true,
                equipment_user_id: true, // Select other equipment fields
                equipment_image: true,
                equipment_name: true,
                equipment_description: true,
                equipment_type: true,
                equipment_price: true,
                equipment_pic_name: true,
                equipment_pic_phoneNum: true,
                equipment_status: true,
                created_at: true,
                
                // Use the correct relations to get lookup values
                lookup_equipment_equipment_typeTolookup: {
                    select: {
                        lookupValue: true, // Get the lookup value for equipment_type
                    }
                },
                lookup_equipment_equipment_statusTolookup: {
                    select: {
                        lookupValue: true, // Get the lookup value for equipment_status
                    }
                }
            }
        });

        const user = await prisma.user.findFirst({
            where: {
                userID: parseInt(id)
            }
        });

        return {
            response: 200,
            success: true,
            data: {
                user,
                equipments
            },
        };
    } catch (error) {
        console.error("Error fetching equipments:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch equipments",
        };
    }
});
