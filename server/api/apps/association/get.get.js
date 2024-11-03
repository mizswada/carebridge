import { DateTime } from "luxon";
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
    
        // Read the body of the request to get user data
        const query = getQuery(event);
        const asso_id = parseInt(query.id);

        const association = await prisma.user.findMany({
            where: {
                userID: parseInt(asso_id),
            },
            select: {
                userID: true,
                userUsername: true,
                userFullName: true,
                userEmail: true,
                userPhone: true,
                userStatus: true,
                // Include the rehab center details
                user_association: {
                    select: {
                        association_address_line1: true,
                        association_address_line2: true,
                        association_address_city: true,
                        association_address_postcode: true,
                        association_address_state: true,
                        association_address_country: true,
                        pic_name: true,
                        pic_phoneNum: true,
                        pic_email: true,
                        document_licenses: true,
                        documents_certificates: true,
                    }
                },
                // Include donation data associated with the user
                donation_donation_donation_user_idTouser: {
                    select: {
                        donation_amount: true,
                        donation_date: true,
                        donation_status: true,
                        donation_reference_number: true
                    }
                },
                // Include activity data associated with the user
                activity: {
                    where: {
                        activity_status: 21,  // Adding condition for activity_status = 21
                        deleted_at: null
                    },
                    select: {
                        activity_title: true,
                        activity_image: true,
                        activity_content: true,
                        activity_status: true,
                        activity_media_url: true
                    }
                }
            }
        });

        return {
            statusCode: 200,
            message: "Data retrieved successfully",
            data: association
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
  