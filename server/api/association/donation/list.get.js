export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);
    const { userID, email, roles } = event.context.user;
    let user;
    try {

        if(roles.includes('Superadmin') || roles.includes('Admin')) {
            user = await prisma.user.findFirst({
                where: {
                    userID: parseInt(id)
                }
            });
        } else {
            user = await prisma.user.findFirst({
                where: {
                    userUsername: id
                }
            }); 
        }
        

        const totalDonationAmount = await prisma.donation.aggregate({
            where: {
                donation_association_id: parseInt(user.userID),
                donation_status:33,
                deleted_at: null,
            },
            _sum: {
                donation_amount: true,
            },
        });

        const donationSum = totalDonationAmount._sum.donation_amount || 0;
        // Fetch donations where association ID matches and is not deleted
        const donations = await prisma.donation.findMany({
            where: {
                donation_association_id: parseInt(user.userID),
                deleted_at: null,
            },
            select: {
                donation_id:true,
                donation_amount: true,
                donation_date: true,
                donation_status: true,
                donation_reference_number: true,
                created_at: true,
                // Fetch the user related to donation_user_id
                user_donation_donation_user_idTouser: {
                    select: {
                        userFullName: true,
                    },
                },
                // Fetch the lookup value related to donation_status
                lookup: {
                    select: {
                        lookupValue: true,
                    },
                },
            },
        });

        

        return {
            response: 200,
            success: true,
            data: {donations,donationSum,user}
        };
    } catch (error) {
        console.error("Error fetching donations:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch donations",
        };
    }
});
