import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
    // Parse the form data
    const body = await readBody(event);
   
    try {
        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                userUsername: body?.userUsername,
            }
        });
       
        if (existingUser) {
            return {
                response: 409, // Conflict
                success: false,
                error: "Username already exists"
            };
        }

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                userSecretKey:body?.secret_key,
                userCategoryCode:body?.category_code,
                userUsername : body?.userUsername,
                userPassword: sha256(body?.userPassword).toString(), // Note: In production, ensure passwords are hashed
                userFullName:body?.userFullName,
                userEmail: body?.userEmail,
                userPhone :body?.userPhone,
                userStatus:'ACTIVE',
                userIsVerify:0,
                userCreatedDate: new Date(),
            }
        });

        // Assign role to the user
        await prisma.userrole.create({
            data: {
                userRoleUserID: newUser.userID,
                userRoleRoleID: 4, // Assuming 3 is the role ID for association users
                userRoleCreatedDate: new Date(),
            }
        });


        // Create the association record
        const newCenter = await prisma.user_association.create({
            data: {
                user_id: newUser.userID,
                association_category:body?.association_category,
                registration_number:body?.registration_number,
                license_number:body?.license_number,
                membership_details:body?.membership,
                establishment_date: new Date(body?.establishment_date),
                association_type:body?.association_type,
                objectives:body?.objective,
                website:body?.website,
                association_logo:body?.document_logo,
                operational_area: body?.operational_areas,

                association_address_line1:body?.association_address_line1,
                association_address_line2:body?.association_address_line2 || null,
                association_address_city :body?.association_address_city,
                association_address_postcode:body?.association_address_postcode,
                association_address_state:body?.association_address_state,
                association_address_country:body?.association_address_country,
                pic_name:body?.person_in_charge,
                pic_phoneNum:body?.contact_number,
                pic_email:body?.email_address,
                document_licenses:body?.document_licenses,
                documents_certificates:body?.documents_certificates,
                
            }
        });

        return {
            response: 200,
            success: true,
            message: "association created successfully"
        };
    }
    catch (error) 
    {
        console.error("Error creating association:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to create association"
        };
    }
});
