import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    try {
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

        const query = getQuery(event);
        const type = parseInt(query.type);

        const equipmentList = await prisma.equipment.findMany({
            where: { 
                equipment_user_id: parseInt(userID),
                deleted_at: null,
                ...(type !== 0 && {
                    equipment_type: parseInt(type),
                })
            },
        });

        return {
            statusCode: 200,
            data: equipmentList,
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
