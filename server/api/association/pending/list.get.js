// server/api/rehab-center/list.js

export default defineEventHandler(async (event) => {
    try {
        // Fetch rehab centers with related user, state, country, and category details
        const associations = await prisma.user_association.findMany({
            where: {
                user: {
                    userStatus: 'Pending Approval',
                    userrole: {
                        some: {
                            userRoleRoleID: 4
                        }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        userUsername: true,
                        userFullName: true,
                        userEmail: true,
                        userPhone: true,
                        userStatus: true,
                        userCreatedDate: true,
                    }
                },
                lookup_user_association_association_address_countryTolookup: {
                    select: {
                        lookupValue: true,
                    }
                },
                lookup_user_association_association_address_stateTolookup: {
                    select: {
                        lookupValue: true,
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Map the data to format it as desired in the response
        const formattedCenters = associations.map(center => ({
            id: center.user_id,
            user: {            
                username: center.user?.userUsername,
                fullName: center.user?.userFullName,
                email: center.user?.userEmail,
                phone: center.user?.userPhone,
                status: center.user?.userStatus,
                createdDate: center.user?.userCreatedDate,
            },
            address: {
                line1: center.association_address_line1,
                line2: center.association_address_line2,
                city: center.association_address_city,
                postcode: center.association_address_postcode,
                state: center.lookup_user_association_association_address_stateTolookup?.lookupValue,
                country: center.lookup_user_association_association_address_countryTolookup?.lookupValue,
            }            
        }));

        // Return formatted data
        return {
            response: 200,
            success: true,
            data: formattedCenters
        };
    } catch (error) {
        console.error("Error fetching rehab centers:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch rehab centers"
        };
    }
});
