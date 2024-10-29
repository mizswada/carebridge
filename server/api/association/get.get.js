export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);
    try {
        // Fetch user where type is 'association'
        const details = await prisma.user_association.findFirst({
            where: {
                user_id: parseInt(id),
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                userID: parseInt(id),
            }
        }); 

        const activityCount = await prisma.activity.count({
            where: {
                activity_user_id: parseInt(id),
                deleted_at: null,
            },
        });

        const equipmentCount = await prisma.equipment.count({
            where: {
                equipment_user_id: parseInt(id),
                deleted_at: null,
            },
        });

        const totalDonationAmount = await prisma.donation.aggregate({
            _sum: {
                donation_amount: true,
            },
            where: {
                donation_association_id: parseInt(id),
                deleted_at: null,
                donation_status:33,
            },
        });
        const donationSum = totalDonationAmount._sum.donation_amount || 0;

        return {
            response: 200,
            success: true,
            data: {user,details,activityCount,equipmentCount,donationSum}
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch user details",
        };
    }
});
