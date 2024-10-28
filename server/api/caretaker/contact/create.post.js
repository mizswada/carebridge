export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // create contact
        const createContact = await prisma.emergency_contacts.create({
            data: {
              contact_user_id:parseInt(body?.user_id),
              contact_name: body?.contactName ,
              contact_relationship: body?.contactRelationship ,
              contact_phone_number: body?.contactPhone,
              created_at: new Date()
            },
        });
  
        return {
            response: 200,
            message: "Successfully create the data",
            data: createContact,
        };
    } 
    catch (error) 
    {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  });