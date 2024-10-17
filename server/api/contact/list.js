export default defineEventHandler(async () => {
  try {
    //join table
   const contacts = await prisma.emergency_contacts.findFirst({
      include: {
        user: true,
        lookup: true
      },
    });
    console.log(contacts)


    /*  const contacts = await prisma.emergency_contacts.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        contact_id: true,
        contact_user_id: true,
        contact_name: true,
        contact_relationship: true,
        contact_phone_number: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    });  */

    return {
      statusCode: 200,
      message: 'Contacts successfully fetched',
      data: contacts,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error fetching contacts: ' + error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
});
