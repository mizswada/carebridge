import { DateTime } from "luxon";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    console.log("query", query);

    const { user, email } = event.context.user;

    const orderID = query.orderID;
    let paymentData = [];

    if (!orderID) {
      return {
        statusCode: 400,
        message: "Missing required parameters",
      };
    }

    const getPayment = await prisma.donation.findFirst({
      where: {
        donation_billExternalReferenceNo: orderID,
      },
      select: {
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

    console.log("getPayment", getPayment);

    if (!getPayment) {
      return {
        statusCode: 400,
        message: "Payment not found",
      };
    }

    return {
      statusCode: 200,
      message: "Payment found",
      data: {
        paymentDetails: getPayment,
        userEmail: email,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Server Error",
    };
  }
});
