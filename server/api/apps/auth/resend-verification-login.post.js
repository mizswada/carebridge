import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const email = body.email;
    
        const user = await prisma.user.findFirst({
            where: {
                userEmail: email,
            },
        });
    
        if (!user) {
            return {
                statusCode: 400,
                message: "User does not exist",
            };
        }
    
        // Check if there are any existing tokens for this user
        const existingToken = await prisma.token.findFirst({
            where: {
                tokenStatus: "ACTIVE",
                userID: user.userID,
                tokenType: "REGISTRATION",
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
                tokenType: "REGISTRATION",
                tokenExpiryDate: DateTime.now().plus({ days: 1 }).toJSDate(),
                tokenCreatedDate: DateTime.now().toJSDate(),
              },
            });
      
            const url = `${config.public.feURL}/verify-account/${token.tokenUUID}`;
      
            const emailTemplate = replaceEmailTemplateURL(registerTemplate, url);
      
            await mail(
              user.userEmail,
              "Verify Account",
              "Verify Account",
              emailTemplate
            );
          } else {
            const url = `${config.public.feURL}/verify-account/${existingToken.tokenUUID}`;
      
            const emailTemplate = replaceEmailTemplateURL(registerTemplate, url);
      
            await mail(
              user.userEmail,
              "Verify Account",
              "Verify Account",
              emailTemplate
            );
        }

        return {
            statusCode: 200,
            message: "Verification email successfully sent! Please check your email for further instructions",
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            message: "Server error",
        };
    }
});

function generateTokenID() {
    return uuidv4();
}
  
function replaceEmailTemplateURL(template, url) {
    return template.replace(/\[\[verifyAccountLink\]\]/g, url); // Using regex to replace all occurrences
}
  