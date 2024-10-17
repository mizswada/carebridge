import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const config = useRuntimeConfig();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

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
  
        // Check if the user is a "Caretaker"
        if (roles.includes("Caretaker")) {
            // Handle multiple file uploads
            await new Promise((resolve, reject) => {
                upload.fields([
                { name: 'upload_ic', maxCount: 1 },
                { name: 'upload_certificate', maxCount: 1 },
                { name: 'profile_picture ', maxCount: 1 },
                ])(event.req, event.res, (err) => {
                if (err) {
                    console.error("Multer error:", err);
                    return reject(new Error("Multer error during file upload: " + err.message));
                }
                resolve();
                });
            });
        
            const files = event.req.files;
            if (!files || (!files.upload_ic && !files.upload_certificate  && !files.profile_picture)) {
                return { statusCode: 400, message: "No files uploaded" };
            }
        
            const documentIcPath = files.upload_ic ? files.upload_ic[0].path : null;
            const certificatePath = files.upload_certificate ? files.upload_certificate[0].path : null;
            const profilePicturePath = files.profile_picture ? files.profile_picture[0].path : null;

            // Insert into `user_care_taker` table
            const newCaretaker = await prisma.user_care_taker.create({
                data: {
                    user_id: userID,
                    identification_number: body.identification_number,
                    date_of_birth: new Date(body.date_of_birth),
                    gender: body.gender,
                    nationality: body.nationality,
                    address_line_1: body.address_line_1,
                    address_line_2: body.address_line_2,
                    address_postcode: body.address_postcode,
                    address_city: body.address_city,
                    address_state: body.address_state,
                    qualifications: body.qualifications,
                    emergency_contact_name: body.emergency_contact_name,
                    emergency_contact_relationship: body.emergency_contact_relationship,
                    emergency_contact_number: body.emergency_contact_number,
                    working_hours: body.working_hours,
                    languages_spoken: body.languages_spoken,
                    documents_ic: documentIcPath,
                    documents_certificate: certificatePath,
                    health_status: body.health_status,
                    profile_picture: profilePicturePath,
                    bank_account_name: body.bank_account_name,
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
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            message: "Something went wrong! Please contact your administrator.",
        };
    }
  });
  