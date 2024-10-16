import sha256 from "crypto-js/sha256.js";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const token = body.token;
    const password = body.password;
    const confirmPassword = body.confirmPassword;

    if (!token || !password || !confirmPassword) {
      return {
        statusCode: 400,
        message: "Invalid request",
      };
    }

    if (password !== confirmPassword) {
      return {
        statusCode: 400,
        message: "Password does not match",
      };
    }

    const tokenRecord = await prisma.token.findFirst({
      where: {
        tokenUUID: token,
      },
    });

    if (!tokenRecord) {
      return {
        statusCode: 400,
        message: "Token does not exist",
      };
    }

    const userRecord = await prisma.user.findFirst({
      where: {
        userID: tokenRecord.userID,
      },
    });

    if (!userRecord) {
      return {
        statusCode: 400,
        message: "User does not exist",
      };
    }

    const hashedPassword = sha256(password).toString();

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
        statusCode: 500,
        message: "Failed to update password",
      };
    }

    const updateToken = await prisma.token.update({
      where: {
        tokenID: tokenRecord.tokenID,
      },
      data: {
        tokenStatus: "INACTIVE",
      },
    });

    if (!updateToken) {
      return {
        statusCode: 500,
        message: "Failed to update token",
      };
    }

    return {
      statusCode: 200,
      message: "Password updated",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Server error",
    };
  }
});
