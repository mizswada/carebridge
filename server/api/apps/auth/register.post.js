import sha256 from "crypto-js/sha256.js";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Check if email already exists
    const isEmailValid = await validateEmail(body.email);
    console.log(body.email);
    if (!isEmailValid) {
      return {
        statusCode: 400,
        message: "Email already exists",
      };
    }

    const hashedPassword = sha256(body.password).toString();

    // Add New User
    const user = await prisma.user.create({
      data: {
        userPassword: hashedPassword,
        //userFullName: body?.fullname || "",
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
            userRoleRoleID: parseInt(body.role),
            userRoleCreatedDate: new Date(),
          },
      });

      const token = await prisma.token.create({
        data: {
          tokenUUID: generateTokenID(),
          user: {
            connect: {
              userID: user.userID,
            },
          },
          tokenType: "REGISTRATION",
          tokenExpiryDate: DateTime.now().plus({ days: 1 }).toJSDate(),
          tokenCreatedDate: DateTime.now().toJSDate(),
        },
      });

      const url = `${config.public.feURL}/verify-account/${token.tokenUUID}`;

      const emailTemplate = replaceEmailTemplateURL(registerTemplate, url);
      /* const emailTemplate = replaceEmailTemplateURL(registerTemplate, {
        verifyAccountLink: url,
      }); */

      // Send verification email
      await mail(
        user.userEmail,
        "Verify Account",
        "Verify Account",
        emailTemplate
      );

      return {
        statusCode: 200,
        message: "User successfully added! Please verify your account.",
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
      //message: "Internal server error",
      message: error.message,
    };
  }
});


async function validateEmail(email) {
  const user = await prisma.user.findFirst({
    where: {
      userEmail: email,
    },
  });

  if (user) {
    return false;
  }

  return true;
}

function generateTokenID() {
  return uuidv4();
}

/* function replaceEmailTemplateURL(template, params) {
  let modifiedTemplate = template;

  Object.keys(params).forEach((key) => {
    const placeholder = `[[${key}]]`;
    modifiedTemplate = modifiedTemplate.replace(new RegExp(placeholder, 'g'), params[key]);
  });

  return modifiedTemplate;
} */

function replaceEmailTemplateURL(template, url) {
  return template.replace(
    "[[verifyAccountLink]]", url
  );
} 

