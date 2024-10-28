export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        
        // Update user
        const updateuser = await prisma.user.update({
            where: {
                userID: parseInt(body?.id),
            },
            data: {
                userSecretKey:body?.secret_key,
                userUsername:body?.category_code,
                userFullName:body?.userFullName,
                userEmail: body?.userEmail,
                userPhone :body?.userPhone,
                userModifiedDate: new Date(),
            },
        });

        // const details = await prisma.user_rehab_center.findFirst({
        //     where: {
        //         user_id: parseInt(body?.id),
        //     }
        // })

        // Update user
        const updateDetails = await prisma.user_association.updateMany({
            where: {
                user_id: parseInt(body?.id),
            }, 
            data: {
                association_category:body?.association_category,
                registration_number:body?.registration_number,
                license_number:body?.license_number,
                membership_details :body?.membership,
                establishment_date:new Date(body?.establishment_date),
                association_type:body?.association_type,
                objectives:body?.objective,
                website:body?.website,
                association_logo:body?.document_logo,
                operational_area:body?.operational_areas,
                association_address_line1:body?.association_address_line1,
                association_address_line2:body?.association_address_line2,
                association_address_city:body?.association_address_city,
                association_address_postcode :body?.association_address_postcode,
                association_address_state:body?.association_address_state,
                association_address_country:body?.association_address_country,
                pic_name:body?.person_in_charge,
                pic_phoneNum:body?.contact_number,
                pic_email:body?.email_address,
                document_licenses:body?.document_licenses,
                documents_certificates:body?.documents_certificates
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateDetails,
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