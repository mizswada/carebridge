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
        const category = parseInt(query.category);

        // Assuming you know the role ID for Rehab Center (let's say it's 2)
        const rehabCenterRoleID = 3;

        // Query to find users with the role of Rehab Center and include associated data
        const rehabCenters = await prisma.user.findMany({
            where: {
                userrole: {
                    some: {
                        userRoleRoleID: rehabCenterRoleID,
                    }
                },
                ...(category !== 0 && {
                    user_rehab_center: {
                        center_category: category  // Adding condition for center_category only if category is not 0
                    }
                })
            },
            select: {
                userID: true,
                userUsername: true,
                userFullName: true,
                userEmail: true,
                userPhone: true,
                userStatus: true,
                // Include the rehab center details
                user_rehab_center: {
                    select: {
                        center_address_line1: true,
                        center_address_city: true,
                        center_address_postcode: true,
                        center_address_state: true,
                        center_address_country: true,
                        registration_number: true,
                        license_number: true,
                        contact_number: true,
                        email_address: true,
                        center_capacity: true,
                        operational_hours: true,
                        center_description: true,
                        geolocation: true,
                        website: true
                    }
                },
                // Include equipment data associated with the user
                equipment: {
                    select: {
                        equipment_id: true,
                        equipment_name: true,
                        equipment_description: true,
                        equipment_price: true,
                        equipment_rent_type: true,
                        equipment_rent_period: true,
                        equipment_image: true,
                        equipment_rent_sdate: true,
                        equipment_rent_edate: true,
                        equipment_pic_name: true,
                        equipment_pic_phoneNum: true,
                        equipment_status: true,

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
                // Include advertising data associated with the user
                advertising: {
                    select: {
                        advertising_image: true,
                        advertising_media_url: true,
                        advertising_status: true
                    }
                },
                // Include activity data associated with the user
                activity: {
                    where: {
                        activity_status: 21  // Adding condition for activity_status = 21
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
            data: rehabCenters
        };

  
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  