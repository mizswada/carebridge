import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
  // Retrieve the `id` from the query parameters
  const { id } = getQuery(event);

  if (!id) {
    throw new Error("Association ID is required to export donations.");
  }

  // Fetch donation data based on the association ID
  const data = await prisma.donation.findMany({
    where: {
      donation_association_id: parseInt(id),  // Use the ID from the query
      deleted_at: null,
    },
    select: {
      donation_amount: true,
      donation_date: true,
      donation_reference_number: true,
      user_donation_donation_user_idTouser: {
        select: { userUsername: true },
      },
      lookup: {
        select: { lookupValue: true },
      },
    },
  });

  // Log data to ensure it's retrieved correctly
//   console.log("Fetched data for Excel export:", data);

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Donation Data');

  // Define columns based on the data structure
  worksheet.columns = [
    { header: 'Donor', key: 'donor', width: 25 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Reference', key: 'reference', width: 20 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  // Add rows to the worksheet with correct mappings
  data.forEach((item) => {
    worksheet.addRow({
      donor: item.user_donation_donation_user_idTouser.userUsername,  // Donor's username
      amount: parseInt(item.donation_amount),                                    // Donation amount
      reference: item.donation_reference_number,                       // Reference number
      date: formatDate(item.donation_date),                            // Formatted date
      status: item.lookup.lookupValue,                                 // Status from lookup table
    });
  });

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Set headers for file download
  event.res.setHeader('Content-Disposition', 'attachment; filename="donation_data.xlsx"');
  event.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // Return the buffer as the response
  return buffer;
});

// Helper function to format date
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
