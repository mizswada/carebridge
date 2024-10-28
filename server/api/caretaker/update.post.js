export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    // return {
    //     response: 200,
    //     message: "Successfully update the data",
    //     data: body?.pic_relationship,
    // };
    try {
        const caretakerCount = await prisma.user_care_taker.count({
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

        if(caretakerCount == 0)
        {
            const updateDetails = await prisma.user_care_taker.create({
                data: {
                    user_id: parseInt(body?.id),
                    date_of_birth:new Date(body?.caretaker_dob),
                    identification_number:body?.caretaker_ic,
                    gender:body?.caretaker_gender,
                    race:body?.caretaker_race,
                    religion:body?.caretaker_religion,
                    marital_status:body?.caretaker_marital,
                    nationality:body?.caretaker_nationality,
                    address_line_1: body?.caretaker_address_line1,
                    address_line_2: body?.caretaker_address_line2 || null,
                    address_postcode:body?.caretaker_address_postcode,
                    address_city:body?.caretaker_address_city,
                    address_state:body?.caretaker_address_state,
                    qualifications: body?.caretaker_qualification,    
                    emergency_contact_name:body?.pic_name,
                    emergency_contact_relationship:parseInt(body?.pic_relationship) ,
                    emergency_contact_number :body?.pic_phone,
                    working_hours:body?.caretaker_workinghour,
                    languages_spoken:body?.caretaker_languages_spoken,
                    documents_certificate:body?.documents_certificates || null,
                    documents_ic:body?.documents_ic || null,
                    health_status:body?.caretaker_healthStatus,
                    profile_picture:body?.profile_picture || null,
                    bank_account_name:body?.bankName,
                    bank_account_num:body?.acc_number,
                    bank_account_beneficiary:body?.ben_name,
                    created_at: new Date()
                    
                }
            });
        }
        else{
            // Update user
            const updateDetails = await prisma.user_care_taker.updateMany({
                where: {
                    user_id: parseInt(body?.id),
                },
                data: {
                    user_id: parseInt(body?.id),
                    date_of_birth:new Date(body?.caretaker_dob),
                    identification_number:body?.caretaker_ic,
                    gender:body?.caretaker_gender,
                    race:body?.caretaker_race,
                    religion:body?.caretaker_religion,
                    marital_status:body?.caretaker_marital,
                    nationality:body?.caretaker_nationality,
                    address_line_1: body?.caretaker_address_line1,
                    address_line_2: body?.caretaker_address_line2 || null,
                    address_postcode:body?.caretaker_address_postcode,
                    address_city:body?.caretaker_address_city,
                    address_state:body?.caretaker_address_state,
                    qualifications: body?.caretaker_qualification,    
                    emergency_contact_name:body?.pic_name,
                    emergency_contact_relationship:parseInt(body?.pic_relationship) ,
                    emergency_contact_number :body?.pic_phone,
                    working_hours:body?.caretaker_workinghour,
                    languages_spoken:body?.caretaker_languages_spoken,
                    documents_certificate:body?.documents_certificates,
                    documents_ic:body?.documents_ic,
                    health_status:body?.caretaker_healthStatus,
                    profile_picture:body?.profile_picture,
                    bank_account_name:body?.bankName,
                    bank_account_num:body?.acc_number,
                    bank_account_beneficiary:body?.ben_name,
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
        console.error("Error update caretaker:", error);

      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });