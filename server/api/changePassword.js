import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    // return {
    //     response: 500,
    //     success: true,
    //     message: JSON.stringify(body)
    // };
    try {
        const currentUser = await prisma.user.findFirst({
            where: {
                userID: body?.id,
            },
        });

        const hashedPassword = sha256(body?.oldPassword).toString();
        if (currentUser.userPassword !== hashedPassword) {
            return {
                response: 401,
                success: true,
                message: "Old password not match",
            };
        }

        if (currentUser.userPassword == sha256(body?.newPassword).toString()) {
            return {
                response: 401,
                success: true,
                message: "New password cannot be same as old password",
            };
        }

        const update = await prisma.user.updateMany({
            where: {
                userID: body?.id,
            },
            data: {
                userPassword: sha256(body?.newPassword).toString()
            },
        });

        return {
            response: 200,
            success: true,
            message: "Password successfully updated"
        };
      
    } catch (error) {
        console.error("Error change password:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to change password"
        };
    }
  });
  