import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        // Decode token to get the role and user ID
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or invalid",
            };
        }
    
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.auth.secretAccess);
        
        const userID = decodedToken.userID;
        const roles = decodedToken.roles;

        // Retrieve user details
        const user = await prisma.user.findUnique({
            where: { userID: parseInt(userID) },
            select: {
                userFullName: true,
                userPhone: true,
                userEmail: true,
            },
        });

        if (!user) {
            return {
                statusCode: 404,
                message: "User not found",
            };
        }

        let profileData = { user };

        // Check if the user is a "Caretaker" and retrieve caretaker-specific data
        if (roles.includes("Caretaker")) {
            const caretakerProfile = await prisma.user_care_taker.findUnique({
                where: { user_id: parseInt(userID) },
                select: {
                    identification_number: true,
                    race: true,
                    religion: true,
                    marital_status: true,
                    date_of_birth: true,
                    gender: true,
                    nationality: true,
                    address_line_1: true,
                    address_line_2: true,
                    address_postcode: true,
                    address_city: true,
                    address_state: true,
                    qualifications: true,
                    emergency_contact_name: true,
                    emergency_contact_relationship: true,
                    emergency_contact_number: true,
                    working_hours: true,
                    languages_spoken: true,
                    documents_ic: true,
                    documents_certificate: true,
                    health_status: true,
                    profile_picture: true,
                    bank_account_name: true,
                    bank_account_num: true,
                    bank_account_beneficiary: true,
                },
            });

            if (caretakerProfile) {
                profileData = { ...profileData, ...caretakerProfile };
            }
        }

        // Check if the user is a "Client" and retrieve client-specific data
        if (roles.includes("Client")) {
            const clientProfile = await prisma.user_client.findFirst({
                where: { user_id: parseInt(userID) },
                select: {
                    dateOfBirth: true,
                    identification_number: true,
                    race: true,
                    religion: true,
                    marital_status: true,
                    occupation: true,
                    gender: true,
                    addressLine1: true,
                    addressLine2: true,
                    city: true,
                    state: true,
                    postcode: true,
                    country: true,
                    medicalConditions: true,
                    medications: true,
                },
            });

            if (clientProfile) {
                profileData = { ...profileData, ...clientProfile };
            }
        }

        return {
            statusCode: 200,
            message: "Profile retrieved successfully",
            data: profileData,
        };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 400,
                message: "Your session has expired. Please log in again.",
            };
        }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
});
