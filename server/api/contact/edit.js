import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const contactId = event.context.params.id;

  try {
    if (!body.contact_user_id || !body.contact_name || !body.contact_phone_number || !body.contact_phone_number ) {
      return {
        statusCode: 400,
        message: 'Please provide all required fields (User Full Name, Contact Name, Relationship, Phone Number)',
      };
    }

    const updatedContact = await prisma.emergency_contacts.update({
      where: {
        contact_id: parseInt(contactId),
      },
      data: {
        contact_user_id: body.contact_user_id,
        contact_name: body.contact_name,
        contact_relationship: body.contact_relationship,
        contact_phone_number: body.contact_phone_number,
        updated_at: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error updating contact: ' + error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
});
