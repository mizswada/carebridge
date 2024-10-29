import { DateTime } from "luxon";
import axios from "axios";
import jwt from 'jsonwebtoken';


const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    try {
        // Decode token to get the role and user ID
        const authHeader = event.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or invalid",
            };
        }
    
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.auth.secretAccess);
        
        const userID = decodedToken.userID;
        const roles = decodedToken.roles;
    
        // Read the body of the request to get user data
        const body = await readBody(event);

        console.log("Request body:", body); // Debugging log

        const user = await getUserInfo(userID);
            if (!user) {
            return {
                statusCode: 400,
                message: "Unauthorized",
            };
        }

        const genOrderId = await generateOrderId();

        const getToyyibPay = await processToyyibPay(
            config.toyyibPay.secretKey,
            config.toyyibPay.categoryCode,
            user.payorName,
            user.payorEmail,
            user.payorPhone,
            body.job_payment,
            genOrderId
        );
      
        if (!getToyyibPay) {
            return {
              statusCode: 400,
              message:
                "Payment configuration is incorrect. Contact administrator to resolve this issue.",
            };
        }

        // Parse job_date and job_time to correct formats
        const parsedJobDate = body.job_date
            ? DateTime.fromFormat(body.job_date, 'dd-MM-yyyy').toJSDate()
            : null;

        if (!parsedJobDate || isNaN(parsedJobDate.getTime())) {
            return {
                statusCode: 400,
                message: "Invalid job_date format. Expected format is 'dd-MM-yyyy'.",
            };
        }

        const parsedJobTime = body.job_time
            ? DateTime.fromISO(`1970-01-01T${body.job_time}`).toJSDate()
            : null;

        const newJob = await prisma.jobs.create({
            data: {
                job_user_id: parseInt(userID),
                job_category: parseInt(body.job_category),
                job_title: body.job_title,
                job_location_city: body.job_location_city,
                job_location_state: parseInt(body.job_location_state),
                job_date: parsedJobDate,
                job_time: parsedJobTime,
                job_duration: parseInt(body.job_duration),
                job_payment: parseFloat(body.job_payment),
                job_notes: body.job_notes ,
                job_additionalCare: parseInt(body.job_stayin),
                job_caretaker_type: parseInt(body.job_caretaker_type),
                job_billcode: getToyyibPay.billCode,
                job_billExternalReferenceNo: getToyyibPay.data.billExternalReferenceNo,
                job_paymentStatus: "Pending Payment", // PENDING
                job_paymentFlag: 0,
                job_paymentDescription: getToyyibPay.data.billDescription,
                created_at: new Date(),
            },
        });

        if(!newJob) {
            return {
                statusCode: 400,
                message: "Failed to create job. Please check your data and try again.",
            };
        }

        /* const createPayment = await prisma.jobs_payment.create({
            data: {
                jobID: parseInt(newJob.job_id),
                userID: parseInt(userID),
                paymentBillName: getToyyibPay.data.billName,
                paymentBillDescription: getToyyibPay.data.billDescription,
                paymentBillCode: getToyyibPay.billCode,
                paymentBillExternalInvoiceNo: getToyyibPay.data.billExternalReferenceNo,
                job_paymentStatus: 2, // PENDING
                paymentFlag: 0,
                paymentPaymentChannel: paymentChannel,
                paymentAmount: parseFloat(totalPrice),
                paymentAmountNett: user.userBillChargeToCustomer
                    ? parseFloat(totalPrice - 1)
                    : parseFloat(totalPrice),
                paymentChargeAmount: user.userBillChargeToCustomer ? 1 : 0,
                paymentDeliveryAmount: parseFloat(totalDeliveryPrice),
                paymentCreatedDate: DateTime.now().toISO(),
            },
          });
      
          if (!createPayment) {
            return {
              statusCode: 400,
              message: "Payment not created",
            };
        } */

        return {
            statusCode: 200,
            message: "Job created successfully",
            data: {
                paymentURL: config.toyyibPay.URL + "/" + getToyyibPay.billCode,
            },
        };
  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 400,
                message: "Your session has expired. Please log in again.",
            };
        }
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            //message: "Something went wrong! Please contact your administrator.",
            message: error.message,
        };
    }
});

async function getUserInfo(uid) {
    const getUser = await prisma.user.findFirst({
        where: {
            userID: parseInt(uid),
        },
        select: {
            userFullName: true,
            userEmail: true,
            userPhone: true,
        },
    });
  
    console.log("getUser", getUser);
  
    if (!getUser) {
      return false;
    }
    
    return {
        userID: getUser.userID,
        payorName: getUser.userFullName,
        payorEmail: getUser.userEmail,
        payorPhone: getUser.userPhone,
    };
}

// Generated id with datetime and random number and check if exist in database
async function generateOrderId() {
    const genOrderId = DateTime.now().toFormat("yyyyMMddHHmmssSSS");
    const order = await prisma.jobs.findUnique({
      where: {
        job_billExternalReferenceNo: genOrderId,
      },
    });
    if (order) {
      return generateOrderId();
    } else {
      return "CBP" + genOrderId;
    } 
}


function cutString(str, len) {
  if (str.length > len) {
    return str.substring(0, len) + "...";
  }
  return str;
}

async function processToyyibPay(
    secretKey,
    categoryCode,
    payorName,
    payorEmail,
    payorPhone,
    totalPrice,
    genOrderId,
  ) {
    try {
      const toyyibPayURL = config.toyyibPay.apiURL;
      const typCategoryCode = categoryCode;
      const typSecretKey = secretKey;
      console.log("toyyibPayURL", toyyibPayURL);
      console.log("categoryCode", typCategoryCode);
      console.log("secretKey", typSecretKey);
  
      const billPriceSetting = 1;
      const billPayorInfo = 1;
      const billAmount = totalPrice;
  
      const billCallbackUrl =
        config.public.env == "production" || config.public.env == "development"
          ? config.toyyibPay.callbackURL
          : "https://field-terror-jesus-serving.trycloudflare.com/api/care-services/payment/callback";

  
      const billReturnUrl = config.toyyibPay.returnURL;
  
      const billExternalReferenceNo = genOrderId;
      const billTo = payorName;
      const billEmail = payorEmail;
      const billPhone = payorPhone;
  
      const billName = "Payment job for careridge";
      const billDescription =
        "Payment for job " +
        billExternalReferenceNo +
        " by " +
        billTo +
        " with total amount RM" +
        totalPrice;
  
      const params = new URLSearchParams();
  
      params.append("userSecretKey", typSecretKey);
      params.append("categoryCode", typCategoryCode);
      params.append("billName", billName);
      params.append("billDescription", cutString(billDescription, 90));
      params.append("billPriceSetting", billPriceSetting);
      params.append("billPayorInfo", billPayorInfo);
      params.append("billReturnUrl", billReturnUrl);
      params.append("billCallbackUrl", billCallbackUrl);
      params.append("billExternalReferenceNo", billExternalReferenceNo);
      params.append("billTo", billTo);
      params.append("billEmail", billEmail);
      params.append("billPhone", billPhone);
      params.append("billAmount", parseFloat(billAmount) * 100);
  
      /* if (billChargeToCustomer) {
        params.append("billChargeToCustomer", "0");
        params.append("billAmount", parseFloat(billAmount - 1) * 100);
      } else {
        params.append("billAmount", parseFloat(billAmount) * 100);
      } */
  
      console.log("Parameters: ", params);
  
      const postToyyibPay = await axios.post(
        toyyibPayURL + "/createBill",
        params
      );
  
      console.log(postToyyibPay.data);
  
      if (!postToyyibPay?.data[0]?.BillCode) {
        return false;
      }
      return {
        billCode: postToyyibPay.data[0].BillCode,
        data: {
          billName: billName,
          billDescription: billDescription,
          billAmount: billAmount,
          billReturnUrl: billReturnUrl,
          billCallbackUrl: billCallbackUrl,
          billExternalReferenceNo: billExternalReferenceNo,
          billTo: billTo,
          billEmail: billEmail,
          billPhone: billPhone,
        },
      };
    } catch (error) {
      console.log(error);
      return false;
    }
}
