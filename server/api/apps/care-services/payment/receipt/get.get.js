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

    const getPayment = await prisma.jobs.findFirst({
      where: {
        job_billExternalReferenceNo: orderID,
      },
      select: {
        user: {
            select: {
                userFullName: true,
                userEmail: true,
                userPhone: true
                
            }
        },
        job_payment: true,
        job_paymentStatus: true,
        job_paymentReferenceNum: true,
        job_paymentDate: true
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
