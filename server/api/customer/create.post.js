import sha256 from "crypto-js/sha256.js";
const config = useRuntimeConfig();
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // Create the user
      const newUser = await prisma.user.create({
        data: {
            userUsername : body?.userUsername,
            userPassword: sha256(body?.userPassword).toString(), // Note: In production, ensure passwords are hashed
            userFullName:null,
            userEmail: body?.userUsername,
            userPhone :null,
            userStatus:'ACTIVE',
            userIsVerify:0,
            userCreatedDate: new Date(),
        }
      });

      if(newUser){
          // Assign role to the user
        await prisma.userrole.create({
            data: {
                userRoleUserID: newUser.userID,
                userRoleRoleID: 5, 
                userRoleCreatedDate: new Date(),
            }
        });

        const token = await prisma.token.create({
          data: {
            tokenUUID: generateTokenID(),
            user: {
              connect: {
                userID: newUser.userID,
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
          newUser.userEmail,
          "Verify Account",
          "Verify Account",
          emailTemplate
        );
  
        return {
          response: 200,
          message: "User successfully registered! Please check your email to verify your account.",
          data: newUser,
        };
      }
      

      
  
      return {
          response: 200,
          message: "Successfully create the data",
          data: newUser,
      };
    } 
    catch (error) 
    {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
});

function generateTokenID() {
  return uuidv4();
}

function replaceEmailTemplateURL(template, url) {
  return template.replace(
    "[[verifyAccountLink]]", url
  );
} 

