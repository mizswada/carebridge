import sha256 from "crypto-js/sha256.js";
import jwt from "jsonwebtoken";

const ENV = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const { useremail, password } = await readBody(event);

    const user = await prisma.user.findFirst({
      where: {
        userEmail: useremail,
      },
    });

    if (!user) {
      return {
        statusCode: 404,
        message: "User does not exist",
      };
    }

    const hashedPassword = sha256(password).toString();
    if (user.userPassword !== hashedPassword) {
      return {
        statusCode: 401,
        message: "Invalid password",
      };
    }

    if(user.userIsVerify === 0){
      return {
        statusCode: 401,
        message: "Please verify your account first",
      };
    }

    // Get user roles
    const roles = await prisma.userrole.findMany({
      where: {
        userRoleUserID: user.userID,
      },
      select: {
        role: {
          select: {
            roleName: true,
          },
        },
      },
    });

    const roleNames = roles.map((r) => r.role.roleName);

    const accessToken = generateAccessToken({
      useremail: user.userEmail,
      roles: roleNames,
    });

    const refreshToken = generateRefreshToken({
      useremail: user.userEmail,
      roles: roleNames,
    });

    // Set cookie httpOnly
    event.res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
    ]);

    let userCareTakerClient;
    if(roles === 'Caretaker'){
      userCareTakerClient = await prisma.user_care_taker.findFirst({
        where: {
          user_id: user.userID,
        },
      });
    }

    // Check if the userCareTaker profile exists
    if (!userCareTakerClient) {
      return {
        statusCode: 404,
        message: "User profile not found. Please complete your profile.",
      };
    }

    // Now check if the profile is complete
    const isProfileComplete = checkProfileCompletion(userCareTakerClient);
    if (!isProfileComplete) {
      return {
        statusCode: 400,
        message: "Please complete your profile before proceeding.",
      };
    }

   
    return {
      statusCode: 200,
      message: "Login success",
      data: {
        user: user,
        roles: roleNames,
      },
    };
    

    
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, ENV.auth.secretAccess, { expiresIn: "1d" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, ENV.auth.secretRefresh, { expiresIn: "30d" });
}

// Function to check if user profile is complete
function checkProfileCompletion(userCareTakerClient) {

  // List of required fields for profile completeness
  const requiredFields = [
    'identification_number',
    'date_of_birth',
    'gender',
    'nationality',
    'address_line_1',
    'address_postcode',
    'address_city',
    'address_state',
    'qualifications',
    'emergency_contact_name',
    'emergency_contact_relationship',
    'emergency_contact_number',
    'working_hours',
    'languages_spoken',
    'documents_ic',
    'health_status',
    'profile_picture',
    'bank_account_name',
    'bank_account_num',
    'bank_account_beneficiary'
  ];

  // Check if each required field is filled
  for (const field of requiredFields) {
    if (!userCareTakerClient[field]) {
      return false; // Profile is incomplete
    }
  }

  return true; // Profile is complete
}

