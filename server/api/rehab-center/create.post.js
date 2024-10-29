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
                userRoleRoleID: 3, // Assuming 3 is the role ID for rehab center users
                userRoleCreatedDate: new Date(),
            }
        });


        // Create the rehab center record
        const newCenter = await prisma.user_rehab_center.create({
            data: {
                user_id: newUser.userID,
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
                center_capacity :parseInt(body?.center_capacity) || null,
                operational_hours:body?.operational_hours,
                website:body?.website,
                documents_logo:body?.documents_logo,
                documents_Licenses:body?.document_licenses,
                documents_certificates:body?.documents_certificates,
                center_description:body?.center_description,
                geolocation:body?.geolocation
            }
        });

        return {
            response: 200,
            success: true,
            message: "Rehab center created successfully"
        };
    }
    catch (error) 
    {
        console.error("Error creating rehab center:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to create rehab center"
        };
    }
});
