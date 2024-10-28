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

    //console.log("decodedToken: ",decodedToken)
 
 
     // Extract the userID from the token payload
     const userID = decodedToken.userID;

    const getSetting = await prisma.setting.findFirst({
      where: {
          setting_name: "term_n_condition",
      },
      select: {
          setting_value: true,
      },
    });

    return {
        statusCode: 200,
        data: getSetting.setting_value
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
      //message: "Internal server error",
      message: error.message,
    };
  }
});