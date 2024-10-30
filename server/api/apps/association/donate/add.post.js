import { DateTime } from "luxon";
import jwt from 'jsonwebtoken';
import axios from "axios";

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

        const association = await getUserInfo(body.association_id);
        if (!association) {
            return {
                statusCode: 400,
                message: "Unauthorized",
            };
        }

        const user = await getUserInfo(userID);
        if (!user) {
            return {
                statusCode: 400,
                message: "Unauthorized",
            };
        }

        const genOrderId = await generateOrderId();

        const getToyyibPay = await processToyyibPay(
            association.userSecretKey,
            association.userCategoryCode,
            association.payorName,
            user.payorName,
            user.payorEmail,
            user.payorPhone,
            body.amt_donate,
            genOrderId
        );

        if (!getToyyibPay) {
            return {
              statusCode: 400,
              message:
                "Payment configuration is incorrect. Contact association to resolve this issue.",
            };
        }

        const getStatus = await getStatusInfo("donation_status", "Pending Payment");
        if (!getStatus) {
            return {
                statusCode: 400,
                message: "Unauthorized",
            };
        }

        const newDonation = await prisma.donation.create({
            data: {
                donation_user_id: parseInt(userID),
                donation_association_id: parseInt(body.association_id),
                donation_amount: parseFloat(body.amt_donate),
                donation_status: parseInt(getStatus.lookupID),
                donation_billcode: getToyyibPay.billCode,
                donation_billExternalReferenceNo: getToyyibPay.data.billExternalReferenceNo,
                donation_paymentFlag: 0,
                donation_paymentDescription: getToyyibPay.data.billDescription,
            },
        });

        if(!newDonation) {
            return {
                statusCode: 400,
                message: "Failed to create donation. Please check your data and try again.",
            };
        }

        return {
            statusCode: 200,
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
            message: "Something went wrong! Please contact your administrator.",
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
            userSecretKey: true,
            userCategoryCode: true
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
        userSecretKey: getUser.userSecretKey,
        userCategoryCode: getUser.userCategoryCode
    };
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

// Generated id with datetime and random number and check if exist in database
async function generateOrderId() {
    const genOrderId = DateTime.now().toFormat("yyyyMMddHHmmssSSS");
    const order = await prisma.donation.findUnique({
      where: {
        donation_billExternalReferenceNo: genOrderId,
      },
    });
    if (order) {
      return generateOrderId();
    } else {
      return "DNT" + genOrderId;
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
      associateName,
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
            ? config.toyyibPay.donationCallbackURL
            : "https://dangerous-rage-bruce-quit.trycloudflare.com/api/apps/association/donate/payment/callback"; 
  
    
        const billReturnUrl = config.toyyibPay.donationReturnURL;
    
        const billExternalReferenceNo = genOrderId;
        const billTo = payorName;
        const billEmail = payorEmail;
        const billPhone = payorPhone;
    
        const billName = "Donation for Association";
        const billDescription =
          "Payment for donation " +
          billExternalReferenceNo +
          " to " +
          associateName +
          "by " +
          billTo +
          " with amount RM" +
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


  