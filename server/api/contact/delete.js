import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contactId = event.context.params.id;

  try {
    const deletedContact = await prisma.emergency_contacts.update({
      where: {
        contact_id: parseInt(contactId),
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: 'Contact deleted successfully',
      data: deletedContact,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error deleting contact: ' + error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
});
