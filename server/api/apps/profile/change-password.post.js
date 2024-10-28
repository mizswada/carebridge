import sha256 from "crypto-js/sha256.js";
import jwt from "jsonwebtoken";
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

    console.log("userID: ",userID)

    const body = await readBody(event);

    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;
    const confirmPassword = body.confirmPassword;

    if (newPassword !== confirmPassword) {
      return {
        statusCode: 400,
        message: "Password does not match",
      };
    }

    const userRecord = await prisma.user.findFirst({
      where: {
        userID: userID,
      },
    });

    if (!userRecord) {
      return {
        statusCode: 400,
        message: "User does not exist",
      };
    }
    // Assuming body.current_pswd contains the current password from the request
    const currentPasswordMatches = userRecord.userPassword === sha256(oldPassword).toString();

    if (!currentPasswordMatches) {
      return {
        statusCode: 403,
        message: "Current password does not match",
      };
    }

    const hashedPassword = sha256(newPassword).toString();

    const updatePassword = await prisma.user.update({
      where: {
        userID: userRecord.userID,
      },
      data: {
        userPassword: hashedPassword,
      },
    });

    if (!updatePassword) {
      return {
        statusCode: 400,
        message: "Failed to update password",
      };
    }

    return {
      statusCode: 200,
      message: "Password has been updated",
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
        return {
            statusCode: 400,
            message: "Your session has expired. Please log in again.",
        };
    }
    console.log(error);
    return {
      statusCode: 500,
      message: "Server error",
    };
  }
});
