import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contactId = event.context.params.id;

  try {
    const contact = await prisma.emergency_contacts.findUnique({
      where: {
        contact_id: parseInt(contactId),
      },
      select: {
        contact_id: true,
        contact_user_id: true,  // This will reference the userID from the user table
        contact_name: true,
        contact_relationship: true,
        contact_phone_number: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    });

    if (contact) {
      return {
        statusCode: 200,
        message: 'Contact successfully fetched',
        data: contact,
      };
    } else {
      return {
        statusCode: 404,
        message: 'Contact not found',
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error fetching contact: ' + error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
});
