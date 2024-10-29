import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";
import sha256 from "crypto-js/sha256.js";

const prisma = new PrismaClient();
const config = useRuntimeConfig();

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
    body.centerCapacity = body.centerCapacity
      ? parseInt(body.centerCapacity, 10)
      : null;

    // Ensure file paths are correctly handled (null if not uploaded)
    const associationLogo = body.associationLogo || null;
    const documentLicenses = body.documentLicenses || null;
    const documentsCertificates = body.documentsCertificates || null;

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
            userPassword: sha256(body.userPassword).toString(), // Use the generated password
            userCreatedDate: new Date(),
            userModifiedDate: new Date(),
            userStatus: "Pending Approval",
          },
        });

        // Step 2: Insert into userrole table with the appropriate roleID
        const createdUserRole = await prisma.userrole.create({
          data: {
            userRoleUserID: createdUser.userID,
            userRoleRoleID: body.roleID,
            userRoleCreatedDate: new Date(),
          },
        });

        // Step 3: Insert into either user_association or user_rehab_center based on roleID
        let createdRecord;
        if (body.roleID === 4) {
          // For associations
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
              pic_name: body.picName,
              pic_phoneNum: body.picPhoneNum,
              pic_email: body.picEmail,
              website: body.website,
              objectives: body.objectives,
              membership_details: body.membershipDetails,
              operational_area: body.operationalArea,
              association_logo: associationLogo, // Store file path
              document_licenses: documentLicenses, // Store file path
              documents_certificates: documentsCertificates, // Store file path
            },
          });
        } else if (body.roleID === 3) {
          // For rehab centers
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
              contact_number: body.contactNumber,
              email_address: body.userEmail,
              center_type: body.centerType,
              person_in_charge: body.userFullName,
              center_capacity: body.centerCapacity,
              operational_hours: body.operationalHours,
              website: body.website,
              geolocation: body.geolocation,
              center_description: body.centerDescription,
              documents_Licenses: documentLicenses, // Store file path
              documents_certificates: documentsCertificates, // Store file path
            },
          });
        }

        return [createdUser, createdRecord, createdUserRole];
      }
    );

    // Generate the verification token without storing it
    // const verificationToken = uuidv4();
    // const verificationURL = `${config.public.feURL}/verify-account/${verificationToken}`;

    // Prepare and send the verification email
    // const emailTemplate = replaceEmailTemplateURL(
    //   registerTemplate,
    //   verificationURL
    // );
    // await mail(
    //   newUser.userEmail,
    //   "Verify Your Account",
    //   "Please verify your account by clicking the link below.",
    //   emailTemplate
    // );

    return {
      success: true,
      message:
        "Your Registration is Completed. Please check your email to verify your account.",
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
function replaceEmailTemplateURL(template, url) {
  return template.replace("[[verifyAccountLink]]", url);
}
