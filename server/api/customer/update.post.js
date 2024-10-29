export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    
    try {
        const customerCount = await prisma.user_client.count({
            where: {
                user_id: parseInt(body?.id),
            },
        });

        // Update user
        const updateuser = await prisma.user.update({
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

        if(customerCount == 0)
        {
            const updateDetails = await prisma.user_client.create({
                data: {
                    user_id: parseInt(body?.id),
                    dateOfBirth:new Date(body?.customer_dob),
                    identification_number:body?.customer_ic,
                    gender:body?.customer_gender,
                    race:body?.customer_race,
                    religion:body?.customer_religion,
                    marital_status:body?.customer_marital,
                    accupation:body?.customer_occupation,
                    addressLine1: body?.customer_address_line1,
                    addressLine2: body?.customer_address_line2 || null,
                    postcode:body?.customer_address_postcode,
                    city:body?.customer_address_city,
                    state:body?.customer_address_state,
                    country: body?.customer_address_country,    
                    medicalConditions:body?.medicalcondition,
                    medications:body?.medications                     
                }
            });
        }
        else{
            // Update user
            const updateDetails = await prisma.user_client.updateMany({
                where: {
                    user_id: parseInt(body?.id),
                },
                data: {
                    user_id: parseInt(body?.id),
                    dateOfBirth:new Date(body?.customer_dob),
                    identification_number:body?.customer_ic,
                    gender:body?.customer_gender,
                    race:body?.customer_race,
                    religion:body?.customer_religion,
                    marital_status:body?.customer_marital,
                    accupation:body?.customer_occupation,
                    addressLine1: body?.customer_address_line1,
                    addressLine2: body?.customer_address_line2 || null,
                    postcode:body?.customer_address_postcode,
                    city:body?.customer_address_city,
                    state:body?.customer_address_state,
                    country: body?.customer_address_country,    
                    medicalConditions:body?.medicalcondition,
                    medications:body?.medications ,
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
        console.error("Error update customer:", error);

      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });