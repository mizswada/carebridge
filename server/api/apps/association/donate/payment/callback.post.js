import { DateTime } from "luxon";
import axios from "axios";

import mail from "@/server/helper/email";
import receiptSubTemplate from "@/server/template/email/receipt-Donation";

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
        const getPayment = await prisma.donation.findFirst({
            where: {
                donation_billExternalReferenceNo: callbackData.order_id,
            },
            select: {
                donation_id: true,
                user_donation_donation_user_idTouser: { //user yg donate
                    select: {
                        userFullName: true,
                        userEmail: true,
                        userPhone: true
                    }
                },
                user_donation_donation_association_idTouser: { //donate ke association ni
                    select: {
                        userFullName: true,
                        userEmail: true,
                        userPhone: true
                    }
                },
                donation_amount: true,
                donation_date: true,
                donation_status: true,
                donation_reference_number: true,
                donation_paymentDescription: true
            },
        });
        console.log("Payment: ");
        console.log(getPayment);

        if (getPayment && !getPayment.paymentFlag) {
            let value = callbackData.status_id == 1 ? "Success Payment" : "Failed Payment";
            const getStatus = await getStatusInfo("donation_status", value);
            if (!getStatus) {
                return {
                    statusCode: 400,
                    message: "Unauthorized",
                };
            }

            const updatePayment = await prisma.donation.update({
                where: {
                    donation_id: getPayment.donation_id,
                },
                data: {
                    donation_status: parseInt(getStatus.lookupID),
                    donation_reference_number: callbackData.refno || null,
                    donation_paymentFlag: parseInt(callbackData.status_id) == 3 ? 0 : 1,
                    donation_date: DateTime.now().toISO(),
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
    let datetimeFormat = DateTime.fromJSDate(getPayment.donation_date)
      .setZone("Asia/Kuala_Lumpur")
      .toFormat("dd/MM/yyyy hh:mm:ss");

    let data = {
        receiptID: getPayment.donation_reference_number,
        amountPaid: parseFloat(callbackData.amount),
        datePaid: datetimeFormat,
        status:
            callbackData.status_id == 1 ? "Payment Success" : "Payment Failed",
        description: getPayment.donation_paymentDescription,
    };

    console.log("Data: ");
    console.log(data);

    // Send email
    const sendEmailPayment = await sendPaymentEmail(
        data,
        getPayment.user_donation_donation_user_idTouser.userEmail
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


async function getStatusInfo(status, value) {
    const getStatus = await prisma.lookup.findFirst({
        where: {
            lookupTitle: status,
            lookupValue: value
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
  
    console.log("getStatus", getStatus);
  
    if (!getStatus) {
      return false;
    }
    
    return {
        lookupID: getStatus.lookupID,
        lookupValue: getStatus.lookupValue
    };
}
