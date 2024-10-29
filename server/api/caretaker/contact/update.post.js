export default defineEventHandler(async (event) => {
    const body = await readBody(event);
   
    try {
        // Update contact
        const updateContact = await prisma.emergency_contacts.updateMany({
            where: {
                contact_id: parseInt(body?.id),
            },
            data: {
                contact_name: body?.contactName ,
                contact_relationship: body?.contactRelationship ,
                contact_phone_number: body?.contactPhone ,
            },
        });
  
        return {
            response: 200,
            message: "Successfully update the data",
            data: updateContact,
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