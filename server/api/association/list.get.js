// server/api/association/list.js

export default defineEventHandler(async (event) => {
    try {
        // Fetch associations with related user, state, country, and category details
        const associations = await prisma.user_association.findMany({
            where: {
                user: {
                    userStatus:  'ACTIVE'
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
                },
                lookup_user_association_association_typeTolookup: {
                    select: {
                        lookupValue: true
                    }
                }
            }
        });

        // Map the data to format it as desired in the response
        const formattedAssociations = associations.map(association => ({
            id: association.user_id,
            user: {
                username: association.user?.userUsername,
                fullName: association.user?.userFullName,
                email: association.user?.userEmail,
                phone: association.user?.userPhone,
                status: association.user?.userStatus,
                createdDate: association.user?.userCreatedDate,
            },
            address: {
                line1: association.association_address_line1,
                line2: association.association_address_line2 || "",
                city: association.association_address_city,
                postcode: association.association_address_postcode,
                state: association.lookup_user_association_association_address_stateTolookup?.lookupValue || "",
                country: association.lookup_user_association_association_address_countryTolookup?.lookupValue || "",
            },
            registration_number: association.registration_number,
            license_number: association.license_number,
            membership_details: association.membership_details,
            establishment_date: association.establishment_date,
            association_type: association.lookup_user_association_association_typeTolookup?.lookupValue || "",
            objectives: association.objectives,
            website: association.website,
            logo: association.association_logo,
            operational_area: association.operational_area,
            pic: {
                name: association.pic_name,
                phoneNum: association.pic_phoneNum,
                email: association.pic_email,
            },
            documents: {
                licenses: association.document_licenses,
                certificates: association.documents_certificates || ""
            },
            category: association.category?.name || "",
            description: association.center_description || "",
            geolocation: association.geolocation || "",
        }));

        // Return formatted data
        return {
            response: 200,
            success: true,
            data: formattedAssociations
        };
    } catch (error) {
        console.error("Error fetching associations:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch associations"
        };
    }
});
