import sha256 from "crypto-js/sha256.js";
import jwt from "jsonwebtoken";

const ENV = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Get user from database
    const allUser = await prisma.user.findMany();

    // Check if the user already exists
    const userExist = allUser.find((user) => {
      return user?.userEmail === body?.useremail;
    });

    if (userExist)
      return {
        statusCode: 400,
        message: "Email already exists",
    };

    // Add New User
    const user = await prisma.user.create({
        data: {
          userPassword: password,
          userFullName: body?.fullname || "",
          userEmail: body?.email || "",
          userStatus: "ACTIVE",
          userCreatedDate: new Date(),
        },
      });

      if (user) {
        // Add user role
        const userRole = await prisma.userrole.create({
            data: {
              userRoleUserID: user.userID,
              userRoleRoleID: body.type,
              userRoleCreatedDate: new Date(),
            },
        });

        return {
          statusCode: 200,
          message: "User successfully added!",
        };
      } else {
        return {
          statusCode: 500,
          message: "Something went wrong! Please contact your administrator.",
        };
      }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, ENV.auth.secretAccess, { expiresIn: "1d" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, ENV.auth.secretRefresh, { expiresIn: "30d" });
}
