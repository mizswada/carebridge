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
        const state = parseInt(query.state);

        // Assuming you know the role ID for Rehab Center (let's say it's 2)
        const rehabCenterRoleID = 4;

        // Query to find users with the role of Rehab Center and include associated data
        const rehabCenters = await prisma.user.findMany({
            where: {
                userStatus: "ACTIVE",
                userrole: {
                    some: {
                        userRoleRoleID: rehabCenterRoleID,
                    }
                },
                ...(state !== 0 && {
                    user_association: {
                        some: {
                            association_address_state: state  // Use the correct nested filter for state
                        }
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
                user_association: {
                    select: {
                        association_address_state: true,
                    }
                }
            }
        });

        if (rehabCenters.length === 0) {
            return {
                statusCode: 400,
                message: "No associantios found.",
                data: []
            };
        }

        return {
            statusCode: 200,
            message: "Data retrieved successfully",
            data: rehabCenters
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
  