import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
  // Fetch payment data (replace this with your actual database query)
  const data = await prisma.jobs_user_assignation.findMany({
    where: {
      jobUser_paymentStatus: parseInt(228),
    },
    include: {   
      jobs:{
          select :{
            job_title:true,
            job_payment:true
        },
      },
      lookup_jobs_user_assignation_jobUser_jobStatusTolookup: true,
      lookup_jobs_user_assignation_jobUser_paymentStatusTolookup: {
        select:{
          lookupValue:true
        }
      },
      user:{
        select: {
          userFullName:true,  
          userPhone:true,
          user_care_taker:{
            select:{
              lookup_user_care_taker_bank_account_nameTolookup:{
                select:{
                  lookupValue:true
                }
              },
              bank_account_num:true,
              bank_account_beneficiary:true,
            }            
          },
        
        }        
      },
    }
  });

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payment Data');

  // Define columns
  worksheet.columns = [
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Customer Phone', key: 'customerPhone', width: 25 },
    { header: 'Job Title', key: 'jobTitle', width: 30 },
    { header: 'Amount Paid', key: 'amountPay', width: 15 },
    { header: 'Bank Name', key: 'bankName', width: 15 },
    { header: 'Bank Account Number', key: 'bankAccNo', width: 15 },
    { header: 'Bank Beneficiary Name', key: 'bankBenName', width: 15 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
  ];

  // Add rows to the worksheet
  data.forEach((item) => {
    worksheet.addRow({
      customerName: item.user.userFullName,
      customerPhone: item.user.userPhone,
      jobTitle: item.jobs.job_title,
      amountPay: parseInt(item.jobs.job_payment),
      bankName: item.user.user_care_taker[0].lookup_user_care_taker_bank_account_nameTolookup?.lookupValue,
      bankAccNo: item.user.user_care_taker[0].bank_account_num,
      bankBenName: item.user.user_care_taker[0].bank_account_beneficiary,
      paymentStatus: item.lookup_jobs_user_assignation_jobUser_paymentStatusTolookup?.lookupValue,
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
