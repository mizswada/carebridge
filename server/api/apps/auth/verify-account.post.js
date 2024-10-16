
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const token = body.token;

    if (!token) {
      return {
        statusCode: 400,
        message: "Token is required",
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

    const updateUser = await prisma.user.update({
        where: {
            userID: tokenRecord.userID,
        },
        data: {
            userIsVerify: 1,
        },
    });

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
      message: "Successfully verify account",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Server error",
    };
  }
});
