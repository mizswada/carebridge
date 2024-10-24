import { v4 as uuidv4 } from "uuid";
import mail from "@/server/helper/email";
import resetPasswordTemplate from "@/server/template/email/reset-Password";
import { DateTime } from "luxon";


const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Check if email already exists
    const isEmailValid = await validateEmail(body.email);
    console.log(body.email);
    if (isEmailValid) {
      return {
        statusCode: 400,
        message: "Email does not exists",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        userEmail: body.email,
      },
    });
   
    // Check if there are any existing tokens for this user
    const existingToken = await prisma.token.findFirst({
    where: {
        tokenStatus: "ACTIVE",
        userID: user.userID,
        tokenType: "FORGOT_PASSWORD",
    },
    });

    if (!existingToken) {
    const token = await prisma.token.create({
        data: {
        tokenUUID: generateTokenID(),
        user: {
            connect: {
            userID: user.userID,
            },
        },
        tokenType: "FORGOT_PASSWORD",
        tokenExpiryDate: DateTime.now().plus({ days: 1 }).toJSDate(),
        tokenCreatedDate: DateTime.now().toJSDate(),
        },
    });

    const url = `${config.public.feURL}/reset-password/${token.tokenUUID}`;

    const emailTemplate = replaceEmailTemplateURL(resetPasswordTemplate, url);

    await mail(
        user.userEmail,
        "Reset Password",
        "Reset Password",
        emailTemplate
    );
    } else {
    const url = `${config.public.feURL}/reset-password/${existingToken.tokenUUID}`;

    const emailTemplate = replaceEmailTemplateURL(resetPasswordTemplate, url);

    await mail(
        user.userEmail,
        "Reset Password",
        "Reset Password",
        emailTemplate
    );
    }  

    return {
        statusCode: 200,
        data: {
          date: body.date,
          time: body.time
        }
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Something went wrong! Please contact your administrator.",
    };
  }
});

async function validateEmail(email) {
    const user = await prisma.user.findFirst({
      where: {
        userEmail: email,
      },
    });

    console.log(user);
  
    if (user) {
      return false;
    }
  
    return true;
  }

function generateTokenID() {
  return uuidv4();
}

function replaceEmailTemplateURL(template, url) {
  return template.replace("[[resetPasswordLink]]", url);
}
