import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";

const config = useRuntimeConfig();

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
        
        const user = await prisma.user.findFirst({
            where: {
                userID: tokenRecord.userID,
            },
        });
    
        if (!user) {
            return {
                statusCode: 400,
                message: "User does not exist",
            };
        }

        const addToken = await prisma.token.create({
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
    
        const url = `${config.public.feURL}/verify-account/${addToken.tokenUUID}`;

        const emailTemplate = replaceEmailTemplateURL(registerTemplate, url);

        // Send verification email
        await mail(
            user.userEmail,
            "Verify Account",
            "Verify Account", 
            emailTemplate
        );

        return {
            statusCode: 200,
            message: "Verification email successfully sent.",
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
  