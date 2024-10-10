import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Utility function to generate a random password
const generatePassword = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default defineEventHandler(async (event) => {
  // Parse the incoming request
  const body = await readBody(event);

  // Generate a random password if one is not provided
  body.userPassword = body.userPassword || generatePassword();

  try {
    // Start a transaction to ensure atomicity
    const [newUser, newRecord, newUserRole] = await prisma.$transaction(
      async (prisma) => {
        // Step 1: Create the user record and retrieve the userID
        const createdUser = await prisma.user.create({
          data: {
            userUsername: body.userUsername,
            userEmail: body.userEmail,
            userPhone: body.userPhone,
            userFullName: body.userFullName,
            userCategoryCode: body.userCategoryCode,
            userSecretKey: body.userSecretKey,
            userPassword: body.userPassword, // Use the generated password
            userCreatedDate: new Date(),
            userModifiedDate: new Date(),
            userStatus: "Pending Approval",
          },
        });

        let createdRecord;

        // Step 2: Use the generated userID from createdUser.userID to create associated records
        if (body.roleID === 4) {
          // Association record creation
          createdRecord = await prisma.user_association.create({
            data: {
              user_id: createdUser.userID, // Use the generated userID
              association_type: body.associationType,
              registration_number: body.registrationNumber,
              license_number: body.licenseNumber,
              establishment_date: body.establishmentDate,
              association_address_line1: body.associationAddressLine1,
              association_address_line2: body.associationAddressLine2,
              association_address_city: body.associationAddressCity,
              association_address_postcode: body.associationAddressPostcode,
              association_address_state: body.associationAddressState,
              association_address_country: body.associationAddressCountry,
              contact_person: body.userUsername,
              contact_number: body.contactNumber,
              email_address: body.emailAddress,
              website: body.website,
              affiliations: body.affiliations,
              objectives: body.objectives,
              membership_details: body.membershipDetails,
              operational_area: body.operationalArea,
              supporting_documents: body.supportingDocuments,
              annual_revenue: body.annualRevenue,
              association_logo: body.associationLogo,
            },
          });
        } else if (body.roleID === 3) {
          // Rehab Center record creation
          createdRecord = await prisma.user_rehab_center.create({
            data: {
              user_id: createdUser.userID, // Use the generated userID
              center_address_line1: body.centerAddressLine1,
              center_address_line2: body.centerAddressLine2,
              center_address_city: body.centerAddressCity,
              center_address_postcode: body.centerAddressPostcode,
              center_address_state: body.centerAddressState,
              center_address_country: body.centerAddressCountry,
              registration_number: body.registrationNumber,
              license_number: body.licenseNumber,
              contact_number: body.centerContactNumber,
              email_address: body.centerEmailAddress,
              center_type: body.centerType,
              person_in_charge: body.userUsername,
              center_capacity: body.centerCapacity,
              operational_hours: body.operationalHours,
              website: body.centerWebsite,
              supporting_documents: body.centerSupportingDocuments,
              affiliations: body.centerAffiliations,
              center_description: body.centerDescription,
              geolocation: body.geolocation,
            },
          });
        } else {
          throw new Error("Invalid roleID provided.");
        }

        // Step 3: Insert into userrole table
        const createdUserRole = await prisma.userrole.create({
          data: {
            userRoleUserID: createdUser.userID, // Use the generated UserID
            userRoleRoleID: body.roleID, // Use the selected RoleID
            userRoleCreatedDate: new Date(),
          },
        });

        // Return both the user and the related records
        return [createdUser, createdRecord, createdUserRole];
      }
    );

    // Step 4: Return the response with the user, associated record, and role details
    return {
      success: true,
      message: "Your Registration is Completed",
      user: newUser,
      record: newRecord,
      userRole: newUserRole,
      userID: newUser.userID, // Include the generated userID for convenience
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Your Registration is not complete, please check again the details",
      error: error.message,
    };
  }
});
