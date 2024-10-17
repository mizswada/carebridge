export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate the required fields
    if (!body.contact_user_id || !body.contact_name || !body.contact_relationship || !body.contact_phone_number) {
      return {
        statusCode: 400,
        message: 'Please provide all required fields (User Full Name, Contact Name, Relationship, Phone Number)',
      };
    }

    // Validate the phone number (you can enhance the regex as per your need)
    const phoneRegex = /^[0-9]+$/; // Simple validation for digits only (expand as needed)
    if (!phoneRegex.test(body.contact_phone_number)) {
      return {
        statusCode: 400,
        message: 'Please provide a valid phone number',
      };
    }

    // Add new contact to emergency_contacts table
    const contact = await prisma.emergency_contacts.create({
      data: {
        contact_user_id: parseInt(body.contact_user_id),  // Ensure user ID is stored as an integer
        contact_name: body.contact_name,
        contact_relationship: parseInt(body.contact_relationship),  // Use as a string directly (from lookup)
        contact_phone_number: body.contact_phone_number,
        created_at: new Date(),  // Add current timestamp for created_at
      },
    });

    return {
      statusCode: 201,
      message: "Contact added successfully",
      data: contact,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error adding contact: ' + error.message,
    };
  }
});
