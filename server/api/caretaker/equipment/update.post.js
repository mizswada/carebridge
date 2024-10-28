export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // Update equipment
        const updateEquipment = await prisma.equipment.updateMany({
            where: {
                equipment_id: parseInt(body?.equipmentID),
            },
            data: {
                equipment_name:body?.nameInput,
                equipment_type:parseInt(body?.typeInput),
                equipment_price:body?.priceInput,
                equipment_image:body?.imageInput,
                equipment_description:body?.descriptionInput,
                equipment_pic_name:body?.namePIC,
                equipment_pic_phoneNum:body?.phonePIC,
                equipment_status:parseInt(body?.statusInput),
                updated_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateEquipment,
        };
    } 
    catch (error) 
    {
        console.error("Error update equipment details:", error);
        return {
            statusCode: 500,
            message: error.message,
        };
    }
  });