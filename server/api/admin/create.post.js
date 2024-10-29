import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        // Create the user
      const newUser = await prisma.user.create({
        data: {
            userUsername : body?.userUsername,
            userPassword: sha256(body?.userPassword).toString(), // Note: In production, ensure passwords are hashed
            userFullName:body?.userFullName,
            userEmail: body?.userEmail,
            userPhone :body?.userPhone,
            userStatus:'ACTIVE',
            userIsVerify:1,
            userCreatedDate: new Date(),
        }
      });

      // Assign role to the user
      await prisma.userrole.create({
          data: {
              userRoleUserID: newUser.userID,
              userRoleRoleID: 2, 
              userRoleCreatedDate: new Date(),
          }
      });

      // Create the rehab center record
      const newAdmin = await prisma.user_admin.create({
        data: {
            admin_user_id: newUser.userID,
            admin_gender:body?.admin_gender,
            admin_date_of_birth: new Date(body?.admin_date_of_birth),
            admin_address_line1:body?.admin_address_line1 ,
            admin_address_line2:body?.admin_address_line2 || null,
            admin_address_city :body?.admin_address_city,
            admin_address_postcode:body?.admin_address_postcode,
            admin_address_state:body?.admin_address_state,
            admin_address_country:body?.admin_address_country,
        }
      });
  
      return {
          response: 200,
          message: "Successfully create the data",
          data: newAdmin,
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