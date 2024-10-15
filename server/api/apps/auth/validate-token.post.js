import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const token = body.token;
    const token_type = body.token_type

    if (!token) {
      return {
        statusCode: 400,
        message: "Token is required",
      };
    }

    const tokenRecord = await prisma.token.findFirst({
      where: {
        tokenUUID: token,
        tokenStatus: "ACTIVE",
        tokenType: token_type,
      },
    });

    if (!tokenRecord) {
      return {
        statusCode: 404,
        message: "Token does not exist or already used",
      };
    }

    if (tokenRecord.tokenExpiryDate < DateTime.now().toJSDate()) {
      // Update token status to EXPIRED
      await prisma.token.update({
        where: {
          tokenUUID: token,
        },
        data: {
          tokenStatus: "EXPIRED",
        },
      });

      return {
        statusCode: 400,
        message: "Token is expired",
      };
    }

    return {
      statusCode: 200,
      message: "Token is valid",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Server error",
    };
  }
});
