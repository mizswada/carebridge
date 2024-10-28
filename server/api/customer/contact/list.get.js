export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);
  
    try {
        // Fetch contacts and their associated contact_status from lookup table
        const contacts = await prisma.emergency_contacts.findMany({
            where: {
                contact_user_id: parseInt(id),
                deleted_at: null,
            },
            include: {
                lookup: { // This assumes that your relation is defined as "lookup" in your Prisma schema
                    select: {
                        lookupValue: true, // Adjust based on the actual field name in the lookup table
                    },
                },
            },
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
                contacts,
            },
        };
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch contacts",
        };
    }
  });
  