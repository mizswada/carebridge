import { useUserStore } from "~/stores/user";

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);
    const userRole = useUserStore().roles[0];  // Get user role
    
    let user;
    try { 

        if (userRole === 'Admin' || userRole === 'Superadmin') {
            user = await prisma.user.findFirst({
                where: {
                    userID: parseInt(id)
                }
            });

        } else {
            user = await prisma.user.findFirst({
                where: {
                    userEmail: id
                }
            });
        }
        // Fetch advertisings and their associated lookup (advertising status)
        const advertisings = await prisma.advertising.findMany({
            where: {
                advertising_user_id: parseInt(user.userID),
                deleted_at: null,
            },
            select: {
                advertising_id: true,
                advertising_user_id: true, 
                advertising_image: true,
                advertising_media_url: true,                
                created_at: true,
                lookup: {  // Correct relation name based on your schema
                    select: {
                        lookupValue: true,  // Assuming "status_name" is a field in the lookup model
                    }
                }
            }
        });

        
        return {
            response: 200,
            success: true,
            data: {
                user,
                advertisings
            },
        };
    } catch (error) {
        console.error("Error fetching advertisings:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch advertisings",
        };
    }
});
