import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {

    // Retrieve the token from the Authorization header
    const authHeader = event.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 400,
        message: "Authorization header is missing or invalid",
      };
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.auth.secretAccess); // Replace with your actual secret

    console.log("decodedToken: ",decodedToken)


    // Extract the userID from the token payload
    const userID = decodedToken.userID;
    if (!userID) {
      throw new Error("User ID not found in token");
    }

    console.log("userID: ",userID)

    const emergency_contacts = await prisma.emergency_contacts.findMany({
        where: {
            contact_user_id: parseInt(userID),
        },
        select: {
            contact_name: true,
            contact_relationship: true,
            contact_phone_number: true,
        },
    });

    if (!emergency_contacts) {
        return {
          statusCode: 404,
          message: "Data does not exist",
        };
      }

    return {
        statusCode: 200,
        data: {
            emergency_contacts: emergency_contacts,
        },
    };

} catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      //message: "Internal server error",
      message: error.message,
    };
  }
});