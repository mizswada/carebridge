import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        // Decode token to get the role and user ID
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or invalid",
            };
        }
    
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.auth.secretAccess);
        
        const userID = decodedToken.userID;
        const roles = decodedToken.roles;
    
        // Read the body of the request to get user data
        const body = await readBody(event);

        const updateUser = await prisma.user.update({
            where: {
                userID: parseInt(userID),
            },
            data: {
                userFullName: body.fullname,
                userPhone: body.mobile_number
            },
        });

        const parseDate = (dateString) => {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date;
        };
       
        // Check if the user is a "Caretaker"
        if (roles.includes("Caretaker")) {

            const existingCaretaker = await prisma.user_care_taker.findFirst({
                where: { user_id: userID },
                select: {
                    id: true,
                    documents_ic: true,
                    documents_certificate: true,
                    profile_picture: true,
                },
            });

            // Initialize response data
            const responseData = {};
            
            // Process profile_picture if provided
            if (body.profile_picture) {
                if (existingCaretaker?.profile_picture) {
                    deleteFile(existingCaretaker.profile_picture);
                }
                responseData.profile_picture = await saveBase64File(body.profile_picture, path.join(process.cwd(), 'public/uploads/profile_pictures'));
            }
        
            // Process upload_ic if provided
            /* if (body.upload_ic) {
                if (existingCaretaker?.documents_ic) {
                    deleteFile(existingCaretaker.documents_ic);
                }
                responseData.upload_ic = await saveBase64File(body.upload_ic, path.join(process.cwd(), 'public/uploads/upload_ic'));
            }

            // Process upload_certificate if provided
            if (body.upload_certificate) {
                if (existingCaretaker?.documents_certificate) {
                    deleteFile(existingCaretaker.documents_certificate);
                }
                responseData.upload_certificate = await saveBase64File(body.upload_certificate, path.join(process.cwd(), 'public/uploads/upload_certificate'));
            }  */
            
            // Insert into `user_care_taker` table
            const newCaretaker = await prisma.user_care_taker.update({
                where: { id: existingCaretaker.id },
                data: { 
                    //...(body.identification_number && { identification_number: body.identification_number }),
                    //...(body.race && !isNaN(parseInt(body.race)) && { race: parseInt(body.race) }),
                   // ...(body.religion && !isNaN(parseInt(body.religion)) && { religion: parseInt(body.religion) }),
                    //...(body.marital_status && !isNaN(parseInt(body.marital_status)) && { marital_status: parseInt(body.marital_status) }),
                    ...(body.dob && { date_of_birth: parseDate(body.dob) }),
                    //...(body.gender && !isNaN(parseInt(body.gender)) && { gender: parseInt(body.gender) }),
                    //...(body.nationality && !isNaN(parseInt(body.nationality)) && { nationality: parseInt(body.nationality) }),
                    address_line_1: body.address_line_1,
                    address_line_2: body.address_line_2,
                    address_postcode: body.postcode,
                    address_city: body.city,
                    ...(body.state && !isNaN(parseInt(body.state)) && { address_state: parseInt(body.state) }),
                    //...(body.qualifications && !isNaN(parseInt(body.qualifications)) && { qualifications: parseInt(body.qualifications) }),
                    //emergency_contact_name: body.emergency_contact_name,
                    //...(body.emergency_contact_relationship && !isNaN(parseInt(body.emergency_contact_relationship)) && { emergency_contact_relationship: parseInt(body.emergency_contact_relationship) }),
                    //emergency_contact_number: body.emergency_contact_number,
                    //...(body.working_hours && !isNaN(parseInt(body.working_hours)) && { working_hours: parseInt(body.working_hours) }),
                    //languages_spoken: body.languages_spoken,
                    //documents_ic: responseData.upload_ic || existingCaretaker?.documents_ic,
                    //documents_certificate: responseData.upload_certificate || existingCaretaker?.documents_certificate,
                    //...(body.health_status && !isNaN(parseInt(body.health_status)) && { health_status: parseInt(body.health_status) }),
                    profile_picture: responseData.profile_picture || existingCaretaker?.profile_picture,
                    //...(body.bank_acc_name && { bank_account_name: body.bank_acc_name }),
                    //bank_account_num: body.bank_acc_num,
                    //bank_account_beneficiary: body.bank_acc_beneficiary,
                },
            });

            return {
                statusCode: 200,
                message: "User profile updated successfully",
                //data: newCaretaker,
            };
        }
    
        // Check if the user is a "Client"
        if (roles.includes("Client")) {

            const clientRecord = await prisma.user_client.findFirst({
                where: { user_id: userID },
                select: { clientID: true },
            });

            if (!clientRecord) {
                return {
                    statusCode: 404,
                    message: "User record not found",
                };
            }
        
            const clientID = clientRecord.clientID;

            // Insert into `user_client` table
            const newClient = await prisma.user_client.update({
                where: { clientID: clientID },
                data: {
                    ...(body.dob && { dateOfBirth: parseDate(body.dob) }),
                    //...(body.identification_number && { identification_number: body.identification_number }),
                    //...(body.race && !isNaN(parseInt(body.race)) && {
                        //lookup_user_client_raceTolookup: { connect: { lookupID: parseInt(body.race) } }
                    //}),
                    //...(body.religion && !isNaN(parseInt(body.religion)) && {
                        //lookup_user_client_religionTolookup: { connect: { lookupID: parseInt(body.religion) } }
                    //}),
                    //...(body.marital_status && !isNaN(parseInt(body.marital_status)) && {
                        //lookup_user_client_marital_statusTolookup: { connect: { lookupID: parseInt(body.marital_status) } }
                    //}),
                    //occupation: body.occupation,
                    //...(body.gender && !isNaN(parseInt(body.gender)) && {
                        //lookup_user_client_genderTolookup: { connect: { lookupID: parseInt(body.gender) } }
                    //}),
                    addressLine1: body.address_line_1,
                    addressLine2: body.address_line_2,
                    city: body.city,
                    ...(body.state && !isNaN(parseInt(body.state)) && {
                        lookup_user_client_stateTolookup: { connect: { lookupID: parseInt(body.state) } }
                    }),
                    postcode: body.postcode,
                    //medicalConditions: body.medicalConditions,
                    //medications: body.medications,
                },
            });
    
            return {
                statusCode: 200,
                message: "User profile updated successfully",
                //data: newClient,
            };
        }
    
        // If role is neither "Caretaker" nor "Client", return an error
        return {
            statusCode: 400,
            message: "Unauthorized: User role not allowed for this operation",
        };
  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 400,
                message: "Your session has expired. Please log in again.",
            };
        }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            //message: "Something went wrong! Please contact your administrator.",
            message: error.message
        };
    }
});

 // Helper function to save Base64 image to the server
 const saveBase64File = async (base64Data, uploadDir) => {


    // Extract the mimeType and base64 string using a regex
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 string format.");
    }

    // Get the file extension
    const mimeType = matches[1]; // E.g., image/png
    const fileExtension = mimeType.split("/")[1]; // E.g., png

    // Strip off the Base64 part and decode the data
    const base64ImageData = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(base64ImageData, "base64");

    // Create a unique filename with the extension
    const uniqueFilename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Full file path
    const fileUploadPath = path.join(uploadDir, uniqueFilename);

    // Write the file to the server
    await fs.promises.writeFile(fileUploadPath, fileBuffer);

    // Return the file path
    return `/uploads/${path.basename(uploadDir)}/${uniqueFilename}`;
};

// Helper function to delete an existing file
const deleteFile = (filePath) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};
  