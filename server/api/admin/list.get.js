export default defineEventHandler(async (event) => {
    try {
        // Fetch admins with related user, state, country, and category details
        const admins = await prisma.user_admin.findMany({
            where: {
                user: {
                    userStatus: 'ACTIVE',
                },
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
                    },
                },
                lookup_user_admin_admin_address_countryTolookup: {
                    select: {
                        lookupValue: true,
                    },
                },
                lookup_user_admin_admin_address_stateTolookup: {
                    select: {
                        lookupValue: true,
                    },
                },
                lookup_user_admin_admin_genderTolookup: {
                    select: {
                        lookupValue: true,
                    },
                },
            },
        });

        // Map the data to format it as desired in the response
        const formattedAdmins = admins.map((admin) => ({
            id: admin.admin_user_id,
            user: {
                username: admin.user?.userUsername,
                fullName: admin.user?.userFullName,
                email: admin.user?.userEmail,
                phone: admin.user?.userPhone,
                status: admin.user?.userStatus,
                createdDate: admin.user?.userCreatedDate,
            },
            address: {
                line1: admin.admin_address_line1,
                line2: admin.admin_address_line2 || "",
                city: admin.admin_address_city,
                postcode: admin.admin_address_postcode,
                state: admin.lookup_user_admin_admin_address_stateTolookup?.lookupValue || "",
                country: admin.lookup_user_admin_admin_address_countryTolookup?.lookupValue || "",
            },
            // Safely access gender field, checking if it exists
            gender: admin.lookup_user_admin_admin_genderTolookup?.lookupValue || "Not Specified",
            dob: admin.admin_date_of_birth,
        }));

        // Return formatted data
        return {
            response: 200,
            success: true,
            data: formattedAdmins,
        };
    } catch (error) {
        console.error("Error fetching admins:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch admins",
        };
    }
});
