export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userID, email, roles } = event.context.user;
    let user_id;
    try {
        // create equipment
        if(roles.includes('Superadmin') || roles.includes('Admin')) {
            user_id=body?.user_id;
        }
        else
        {
          user_id=userID;
        }

        if(body?.namePIC == null)
        {
          const user = await prisma.user.findFirst({
              where: {
                  userID: parseInt(user_id)
              } 
          });

          body.namePIC=user.userFullName;
        }

        if(body?.phonePIC == null)
        {
          const user = await prisma.user.findFirst({
              where: {
                  userID: parseInt(user_id)
              }
          });

          body.phonePIC=user.userPhone;
        }


        
        const createEquipment = await prisma.equipment.create({
            data: {
                equipment_user_id : parseInt(user_id),
                equipment_name:body?.nameInput,
                equipment_type:parseInt(body?.typeInput),
                equipment_price:body?.priceInput,
                equipment_image:body?.imageInput,
                equipment_description:body?.descriptionInput,
                equipment_pic_name:body?.namePIC,
                equipment_pic_phoneNum:body?.phonePIC,
                equipment_status:parseInt(body?.statusInput),
                created_at: new Date()
            },
        });
   
        return {
            response: 200,
            message: "Successfully create the data",
            data: createEquipment,
        };
    } 
    catch (error) 
    {
      console.error("Error create equipment:", error);

      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });