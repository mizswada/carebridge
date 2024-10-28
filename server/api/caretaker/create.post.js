import sha256 from "crypto-js/sha256.js";
const config = useRuntimeConfig();

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

      // Assign role to the user
      await prisma.userrole.create({
          data: {
              userRoleUserID: newUser.userID,
              userRoleRoleID: 6, 
              userRoleCreatedDate: new Date(),
          }
      });

      
  
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

