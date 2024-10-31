import sha256 from "crypto-js/sha256.js";
const config = useRuntimeConfig();
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import mail from "@/server/helper/email";
import registerTemplate from "@/server/template/email/verify-account";
import notifiedAdmin from "@/server/template/email/notified-admin";

export default defineEventHandler(async (event) => {
    // Parse the form data
    const body = await readBody(event);
   
    try {
        // Create the user
        const newUser = await prisma.user.create({
            data: {
                userSecretKey:body?.inputAssociationSecretKey || null,
                userCategoryCode:body?.inputAssociationCategoryCode || null,
                userUsername : body?.inputEmail,
                userPassword: sha256(body?.inputPassword).toString(), // Note: In production, ensure passwords are hashed
                userFullName:body?.inputFullname,
                userEmail: body?.inputEmail,
                userPhone :body?.inputPhone,
                userStatus:'Pending Approval',
                userIsVerify:0,
                userCreatedDate: new Date(),
            }
        });

        // Assign role to the user
        await prisma.userrole.create({
            data: {
                userRoleUserID: newUser.userID,
                userRoleRoleID: body?.roleID,
                userRoleCreatedDate: new Date(),
            }
        });

        if(body?.roleID == 3)//rehab
        {
            const newCenter = await prisma.user_rehab_center.create({
                data: {
                    user_id: newUser.userID,
                    center_category:body?.inputRehabCategory,
                    center_address_line1:body?.inputAddressLine1,
                    center_address_line2:body?.inputAddressLine2 || null,
                    center_address_city :body?.inputCity,
                    center_address_postcode:body?.inputPostcode,
                    center_address_state:body?.inputState,
                    center_address_country:body?.inputCountry,
                    registration_number:body?.inputRegistrationNum,
                    license_number:body?.inputLicenseNum,
                    contact_number:body?.inputPICContact,
                    email_address:body?.inputPICemail,
                    center_type:body?.inputRehabType,
                    person_in_charge:body?.inputPICName,
                    center_capacity :parseInt(body?.inputRehabCapacity) || null,
                    operational_hours:body?.inputRehabOperationHour,
                    website:body?.inputWebsite,
                    documents_logo:body?.inputLogo,
                    documents_Licenses:body?.inputLicense,
                    documents_certificates:body?.inputCertificate,
                    center_description:body?.inputRehabDescription,
                    geolocation:body?.inputRehabGeolocation
                }
            });
        }
        else
        {
            // Create the association record
            const newCenter = await prisma.user_association.create({
                data: {
                    user_id: newUser.userID,
                    association_category:body?.inputAssociationCategory,
                    registration_number:body?.inputRegistrationNum,
                    license_number:body?.inputLicenseNum,
                    membership_details:body?.inputAssociationMembership,
                    establishment_date: new Date(body?.inputAssociationEsablishDate),
                    association_type:body?.inputAssociationType,
                    objectives:body?.inputAssociationObjective,
                    website:body?.inputWebsite,
                    association_logo:body?.inputLogo,
                    operational_area: body?.inputAssociationOperationAreas,

                    association_address_line1:body?.inputAddressLine1,
                    association_address_line2:body?.inputAddressLine2 || null,
                    association_address_city :body?.inputCity,
                    association_address_postcode:body?.inputPostcode,
                    association_address_state:body?.inputState,
                    association_address_country:body?.inputCountry,
                    pic_name:body?.inputPICName,
                    pic_phoneNum:body?.inputPICContact,
                    pic_email:body?.inputPICemail,
                    document_licenses:body?.inputLicense,
                    documents_certificates:body?.inputCertificate,                    
                }
            });
        }
       
        const token = await prisma.token.create({
            data: {
                tokenUUID: generateTokenID(),
                user: {
                connect: {
                    userID: newUser.userID,
                },
                },
                tokenType: "REGISTRATION",
                tokenExpiryDate: DateTime.now().plus({ days: 1 }).toJSDate(),
                tokenCreatedDate: DateTime.now().toJSDate(),
            },
        });
    
        const url = `${config.public.feURL}/verify-account/${token.tokenUUID}`;

        const emailTemplate = replaceEmailTemplateURL(registerTemplate, url);
          /* const emailTemplate = replaceEmailTemplateURL(registerTemplate, {
            verifyAccountLink: url,
          }); */
    
          // Send verification email
        await mail(
            newUser.userEmail,
            "Verify Account",
            "Verify Account",
            emailTemplate
        );

        // const emailTemplate2 = replaceEmailTemplateURL(notifiedAdmin, url);

        // const admin= await prisma.setting.findFirst({
        //     where:{
        //         setting_name:'email'
        //     }
        // });
        // await mail(
        //     admin.setting_value,
        //     "Approve Application",
        //     "Approve Application",
        //     emailTemplate2
        // );

        return {
            response: 200,
            success: true,
            message: "Registration successfully"
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

function generateTokenID() {
    return uuidv4();
  }
  
  function replaceEmailTemplateURL(template, url) {
    return template.replace(
      "[[verifyAccountLink]]", url
    );
  } 