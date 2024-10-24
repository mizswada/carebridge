import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        // Decode token to get the role and user ID
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Authorization header is missing or invalid");
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
  
        // Check if the user is a "Caretaker"
        if (roles.includes("Caretaker")) {

            // Initialize response data
            const responseData = {};
            
            // Process profile_picture if provided
            if (body.profile_picture) {
                const profilePicturePath = await saveBase64File(body.profile_picture, path.join(process.cwd(), 'public/uploads/profile_pictures'));
                responseData.profile_picture = profilePicturePath;
            }
        
            // Process upload_ic if provided
            if (body.upload_ic) {
                const uploadIcPath = await saveBase64File(body.upload_ic, path.join(process.cwd(), 'public/uploads/upload_ic'));
                responseData.upload_ic = uploadIcPath;
            }
        
            // Process upload_certificate if provided
            if (body.upload_certificate) {
                const uploadCertificatePath = await saveBase64File(body.upload_certificate, path.join(process.cwd(), 'public/uploads/upload_certificate'));
                responseData.upload_certificate = uploadCertificatePath;
            } 
            
            // Insert into `user_care_taker` table
            const newCaretaker = await prisma.user_care_taker.create({
                data: { 
                    user_id: userID,
                    identification_number: body.identification_number,
                    race: parseInt(body.race),
                    religion: parseInt(body.religion),
                    marital_status: parseInt(body.marital_status),
                    date_of_birth: new Date(body.date_of_birth),
                    gender: parseInt(body.gender),
                    nationality: parseInt(body.nationality),
                    address_line_1: body.address_line_1,
                    address_line_2: body.address_line_2,
                    address_postcode: body.address_postcode,
                    address_city: body.address_city,
                    address_state: parseInt(body.address_state),
                    qualifications: parseInt(body.qualifications),
                    emergency_contact_name: body.emergency_contact_name,
                    emergency_contact_relationship: parseInt(body.emergency_contact_relationship),
                    emergency_contact_number: body.emergency_contact_number,
                    working_hours: parseInt(body.working_hours),
                    languages_spoken: body.languages_spoken,
                    documents_ic: responseData.upload_ic,
                    documents_certificate: responseData.upload_certificate,
                    health_status: parseInt(body.health_status),
                    profile_picture: responseData.profile_picture,
                    bank_account_name: parseInt(body.bank_account_name),
                    bank_account_num: body.bank_account_num,
                    bank_account_beneficiary: body.bank_account_beneficiary,
                },
            });
    
            return {
                statusCode: 200,
                message: "User profile created successfully",
                //data: newCaretaker,
            };
        }
    
        // Check if the user is a "Client"
        if (roles.includes("Client")) {
            // Insert into `user_client` table
            const newClient = await prisma.user_client.create({
                data: {
                    user_id: userID,
                    dateOfBirth: new Date(body.dateOfBirth),
                    identification_number: body.identification_number,
                    race: parseInt(body.race),
                    religion: parseInt(body.religion),
                    marital_status: parseInt(body.marital_status),
                    occupation: body.occupation,
                    gender: body.gender,
                    addressLine1: body.addressLine1,
                    addressLine2: body.addressLine2,
                    city: body.city,
                    state: body.state,
                    country: body.country,
                    postcode: body.postcode,
                    medicalConditions: body.medicalConditions,
                    medications: body.medications,
                },
            });
    
            return {
                statusCode: 200,
                message: "User profile created successfully",
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
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  