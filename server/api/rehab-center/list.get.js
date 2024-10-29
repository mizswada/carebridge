// server/api/rehab-center/list.js

export default defineEventHandler(async (event) => {
    try {
        // Fetch rehab centers with related user, state, country, and category details
        const rehabCenters = await prisma.user_rehab_center.findMany({
            where: {
                user: {
                    userStatus:'ACTIVE',
                    userrole: {
                        some: {
                            userRoleRoleID: 3
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
                lookup_user_rehab_center_center_address_countryTolookup: {
                    select: {
                        lookupValue: true,
                    }
                },
                lookup_user_rehab_center_center_address_stateTolookup: {
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
        const formattedCenters = rehabCenters.map(center => ({
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
                line1: center.center_address_line1,
                line2: center.center_address_line2,
                city: center.center_address_city,
                postcode: center.center_address_postcode,
                state: center.lookup_user_rehab_center_center_address_stateTolookup?.lookupValue,
                country: center.lookup_user_rehab_center_center_address_countryTolookup?.lookupValue,
            },
            registration_number: center.registration_number,
            license_number: center.license_number,
            contact_number: center.contact_number,
            email_address: center.email_address,
            center_type: center.category?.name,
            person_in_charge: center.person_in_charge,
            center_capacity: center.center_capacity,
            operational_hours: center.operational_hours,
            website: center.website,
            documents: {
                licenses: center.documents_Licenses,
                certificates: center.documents_certificates
            },
            center_description: center.center_description,
            geolocation: center.geolocation,
            status: center.status, // Assuming you may have a status field for Active/Inactive
            createdAt: center.createdAt,
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
