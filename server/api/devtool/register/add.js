import { PrismaClient } from "@prisma/client";
import mail from "~/server/helper/email";
import receiptSubTemplate from "~/server/template/email/receiptSub";
import { DateTime } from "luxon";

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
  const body = await readBody(event);

  // Generate a random password if one is not provided
  body.userPassword = body.userPassword || generatePassword();

  try {
    body.roleID = parseInt(body.roleID, 10);
    body.centerCapacity = parseInt(body.centerCapacity, 10);
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

        // Step 2: Insert into userrole table with the appropriate roleID
        // const roleID = body.selectedOption === "Association" ? 4 : 3; // Define roleID based on selection
        const createdUserRole = await prisma.userrole.create({
          data: {
            userRoleUserID: createdUser.userID,
            userRoleRoleID: body.roleID,
            userRoleCreatedDate: new Date(),
          },
        });

        let createdRecord;
        if (body.roleID === 4) {
          // Step 3: Association record creation
          createdRecord = await prisma.user_association.create({
            data: {
              user_id: createdUser.userID,
              association_category: body.associationCategory,
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
              pic_name: body.picName, // Specific to association contact person
              pic_phoneNum: body.picPhoneNum,
              pic_email: body.picEmail,
              website: body.website,
              objectives: body.objectives,
              membership_details: body.membershipDetails,
              operational_area: body.operationalArea,
              association_logo: body.associationLogo,
              document_licenses: body.documentLicenses,
              documents_certificates: body.documentsCertificates,
            },
          });
        } else if (body.roleID === 3) {
          // Step 3: Rehab Center record creation
          createdRecord = await prisma.user_rehab_center.create({
            data: {
              user_id: createdUser.userID,
              center_address_line1: body.centerAddressLine1,
              center_address_line2: body.centerAddressLine2,
              center_address_city: body.centerAddressCity,
              center_address_postcode: body.centerAddressPostcode,
              center_address_state: body.centerAddressState,
              center_address_country: body.centerAddressCountry,
              registration_number: body.registrationNumber,
              license_number: body.licenseNumber,
              contact_number: body.contactNumber, // Specific to rehab center contact
              email_address: body.userEmail,
              center_type: body.centerType,
              person_in_charge: body.userFullName,
              center_capacity: body.centerCapacity,
              operational_hours: body.operationalHours,
              website: body.website,
              geolocation: body.geolocation,
              center_description: body.centerDescription,
              documents_Licenses: body.documentLicenses,
              documents_certificates: body.documentsCertificates,
            },
          });
        }

        return [createdUser, createdRecord, createdUserRole];
      }
    );

    // Prepare email data
    const datetimeFormat = DateTime.now()
      .setZone("Asia/Kuala_Lumpur")
      .toFormat("dd/MM/yyyy hh:mm:ss");
    const emailData = {
      receiptID: newUser.userID,
      amountPaid: "N/A",
      plan:
        body.selectedOption === "Association" ? "Association" : "Rehab Center",
      duration: "N/A",
      planType: "N/A",
      datePaid: datetimeFormat,
      status: "Pending Approval",
    };

    // Send email
    const emailContent = replaceEmailTemplateWord(
      receiptSubTemplate,
      emailData
    );
    await mail(
      newUser.userEmail,
      "Your Registration Receipt",
      "Your Registration Receipt",
      emailContent
    );

    return {
      success: true,
      message: "Your Registration is Completed",
      user: newUser,
      record: newRecord,
      userRole: newUserRole,
      userID: newUser.userID,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Your Registration is not complete, please check the details",
      error: error.message,
    };
  }
});

// Utility function to replace placeholders in the email template
function replaceEmailTemplateWord(template, data) {
  let emailTemplate = template;
  Object.keys(data).forEach((key) => {
    emailTemplate = emailTemplate.replace(`[[${key}]]`, data[key]);
  });
  return emailTemplate;
}
