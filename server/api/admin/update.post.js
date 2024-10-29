export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        
        // Update user
        const newUser = await prisma.user.update({
            where: {
                userID: parseInt(body?.id),
            },
            data: {
                userFullName:body?.userFullName,
                userEmail: body?.userEmail,
                userPhone :body?.userPhone,
                userModifiedDate: new Date(),
            },
        });

        const count = await prisma.user_admin.count({
            where: {
                admin_user_id: parseInt(body?.id),
            }, 
        });

        if(count == 0)
        {
            const updateuserD = await prisma.user_admin.create({
                data: {
                    admin_user_id: parseInt(body?.id),
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
        }
        else
        {
            // Update user
            const updateuserD = await prisma.user_admin.updateMany({
                where: {
                    admin_user_id: parseInt(body?.id),
                },
                data: {
                    admin_gender:body?.admin_gender,
                    admin_date_of_birth: new Date(body?.admin_date_of_birth),
                    admin_address_line1:body?.admin_address_line1 ,
                    admin_address_line2:body?.admin_address_line2 || null,
                    admin_address_city :body?.admin_address_city,
                    admin_address_postcode:body?.admin_address_postcode,
                    admin_address_state:body?.admin_address_state,
                    admin_address_country:body?.admin_address_country
                },
            });
        }
        
  
        return {
            response: 200,
            message: "Successfully update the data",
           
        };
    } 
    catch (error) 
    {
        console.error("Error update rehab centers:", error);

      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });