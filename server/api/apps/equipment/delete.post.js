import { DateTime } from "luxon";
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

        const body = await readBody(event);
        const equipmentID = body.id;

        const deletedEquipment = await prisma.equipment.update({
            where: { equipment_id: parseInt(equipmentID) },
            data: {
                deleted_at: new Date(),
            }
        });

        return {
            statusCode: 200,
            message: "Equipment deleted successfully",
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
