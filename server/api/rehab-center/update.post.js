export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    // return {
    //     response: 200,
    //     message: "Successfully update the data",
    //     data: body,
    // };

    try {
        
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

        const details = await prisma.user_rehab_center.findFirst({
            where: {
                user_id: parseInt(body?.id),
            }
        })

        // Update user
        const updateDetails = await prisma.user_rehab_center.update({
            where: {
                id: parseInt(details.id),
            },
            data: {
                center_category:body?.center_category,
                center_address_line1:body?.center_address_line1,
                center_address_line2:body?.center_address_line2 || null,
                center_address_city :body?.center_address_city,
                center_address_postcode:body?.center_address_postcode,
                center_address_state:body?.center_address_state,
                center_address_country:body?.center_address_country,
                registration_number:body?.registration_number,
                license_number:body?.license_number,
                contact_number:body?.contact_number,
                email_address:body?.email_address,
                center_type:body?.center_type,
                person_in_charge:body?.person_in_charge,
                center_capacity : parseInt(body?.center_capacity) || null,
                operational_hours:body?.operational_hours,
                website:body?.website,
                documents_Licenses:body?.document_licenses,
                documents_certificates:body?.documents_certificates,
                center_description:body?.center_description,
                geolocation:body?.geolocation
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
        console.error("Error update rehab centers:", error);

      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });