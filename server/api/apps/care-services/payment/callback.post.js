import { DateTime } from "luxon";
import axios from "axios";

import mail from "@/server/helper/email";
import receiptSubTemplate from "@/server/template/email/receipt-Payment";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const callbackData = convertMultipartFormDataToJSON(body);

    console.log("Data Callback from toyyibPay: ");
    console.log(callbackData);

    // --------------------------------------//
    // Example Data Returned from bodyToJson //
    // --------------------------------------//
    /*
        {                                                                                      
          refno: 'TP2307184927256954',
          status: '1',
          reason: 'Approved',
          billcode: 'p5q9m2jm',
          order_id: 'TP77501503',
          amount: '1000.00',
          status_id: '1',
          msg: 'ok',
          transaction_id: 'TP2307184927256954',
          fpx_transaction_id: '2307182033260003',
          hash: 'c25e475838d1e3cdc0776d849d2bfbec',
          transaction_time: '2023-07-18 20:33:26'
        }
        */
    const getPayment = await prisma.jobs.findFirst({
      where: {
          job_billExternalReferenceNo: callbackData.order_id,
      },
      select: {
          job_id: true,
          user: {
              select: {
                  userFullName: true,
                  userEmail: true,
                  userPhone: true
              }
          },
          job_payment: true,
          job_paymentStatus: true,
          job_billExternalReferenceNo: true,
          job_paymentReferenceNum: true,
          job_paymentDescription: true,
          job_paymentDate: true,
      },
    });
    console.log("Payment: ");
    console.log(getPayment);

    if (getPayment && !getPayment.paymentFlag) {
      const updatePayment = await prisma.jobs.update({
        where: {
          job_id: getPayment.job_id,
        },
        data: {
          job_status: callbackData.status_id == 1 ? "ACTIVE" : "PENDING",
          job_paymentReferenceNum: callbackData.refno || null,
          job_paymentStatus: callbackData.status_id == 1 ? "Payment Success" : "Payment Failed" || null,
          job_paymentFlag: parseInt(callbackData.status_id) == 3 ? 0 : 1,
          job_paymentDate: DateTime.now().toISO(),
        },
      });

      console.log("Payment Updated: ");
      console.log(updatePayment);

      if (parseInt(callbackData.status_id) == 1) {
        // Send email receipt
        const sendEmail = await sendEmailReceipt(
          callbackData,
          getPayment
        );
        if (!sendEmail) {
          return {
            statusCode: 400,
            message: "Email receipt not sent",
          };
        }
      }
    }

    return {
      statusCode: 200,
      message: "Berjaya",
    }; 
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Gagal",
    };
  }
});

function convertMultipartFormDataToJSON(formData) {
  const lines = formData.split("\n");
  const json = {};

  lines.forEach((line) => {
    if (line.startsWith("Content-Disposition")) {
      const fieldName = line.match(/name="([^"]+)"/)[1];
      const value = lines[lines.indexOf(line) + 2];

      json[fieldName] = value.trim();
    }
  });

  return json;
}

async function sendEmailReceipt(callbackData, getPayment) {
  try {
 
    // Convert database datetime to dd/mm/yyyy hh:mm:ss
    let datetimeFormat = DateTime.fromJSDate(getPayment.job_paymentDate)
      .setZone("Asia/Kuala_Lumpur")
      .toFormat("dd/MM/yyyy hh:mm:ss");

    let data = {
      receiptID: getPayment.job_paymentReferenceNum,
      amountPaid: parseFloat(callbackData.amount),
      datePaid: datetimeFormat,
      status:
        callbackData.status_id == 1 ? "Payment Success" : "Payment Failed",
      description: getPayment.job_paymentDescription,
    };

    console.log("Data: ");
    console.log(data);

    // Send email
    const sendEmailPayment = await sendPaymentEmail(
      data,
      getPayment.user.userEmail
    );

    if (!sendEmailPayment) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sendPaymentEmail(data, email) {
  try {
    const template = replaceEmailTemplateWord(receiptSubTemplate, data);

    await mail(
      email,
      "Receipt Payment CareBridge",
      "Receipt Payment CareBridge",
      template
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function replaceEmailTemplateWord(template, data) {
  let emailTemplate = template;

  Object.keys(data).forEach((key) => {
    emailTemplate = emailTemplate.replace(`[[${key}]]`, data[key]);
  });

  return emailTemplate;
}
