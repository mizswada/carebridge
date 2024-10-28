import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
  // Fetch payment data (replace this with your actual database query)
  const data = await prisma.jobs.findMany({
    include: {
      user: true, // Assuming there's a relation with `user`
    },
  });

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payment Data');

  // Define columns
  worksheet.columns = [
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Job Title', key: 'jobTitle', width: 30 },
    { header: 'Amount Paid', key: 'amountPay', width: 15 },
    { header: 'Payment Reference', key: 'paymentReferenceNum', width: 20 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
  ];

  // Add rows to the worksheet
  data.forEach((item) => {
    worksheet.addRow({
      customerName: item.user.userFullName,
      jobTitle: item.job_title,
      amountPay: item.job_payment,
      paymentReferenceNum: item.job_paymentReferenceNum,
      paymentStatus: item.job_paymentStatus,
    });
  });

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Set response headers for file download
  event.res.setHeader('Content-Disposition', 'attachment; filename="payment_data.xlsx"');
  event.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // Send the buffer as a response
  return buffer;
});
