export default defineEventHandler(async (event) => {
  try {
    // Fetch assignations with related job, user, and user_care_taker data
    const assignations = await prisma.jobs_user_assignation.findMany({
      include: {
        jobs: {
          select: {
            job_title: true,
            job_payment: true,
          },
        },
        lookup_jobs_user_assignation_jobUser_jobStatusTolookup: {
          select: {
            lookupValue: true,
          },
        },
        lookup_jobs_user_assignation_jobUser_paymentStatusTolookup: {
          select: {
            lookupValue: true,
          },
        },
        user: {
          select: {
            userID: true,
            userFullName: true,
            userEmail: true,
            user_care_taker: {
              select: {
                lookup_user_care_taker_bank_account_nameTolookup: {
                  select: {
                    lookupValue: true, // Fetch the lookup value for bank account name
                  },
                },
                bank_account_num: true,
                bank_account_beneficiary: true,
              },
            },
          },
        },
      },
    });

    // Format the response data
    const responseData = assignations.map((assignation) => ({
      assignationId: assignation.jobUser_id,
      jobTitle: assignation.jobs.job_title,
      jobPayment: assignation.jobs.job_payment,
      userId: assignation.user.userID,
      userName: assignation.user.userFullName,
      userEmail: assignation.user.userEmail,
      assignationStatus: assignation.lookup_jobs_user_assignation_jobUser_jobStatusTolookup?.lookupValue || 'Unknown',
      paymentStatus: assignation.lookup_jobs_user_assignation_jobUser_paymentStatusTolookup?.lookupValue || 'Unknown',
      checkIn: assignation.jobUser_checkIN,
      checkOut: assignation.jobUser_checkOut,
      paymentTransactionNum: assignation.jobUser_paymentTransactionNum,
      rating: assignation.jobUser_rating,
      complaint: assignation.jobUser_complain,
      // User Care Taker Bank Details
      bankAccountName: assignation.user.user_care_taker?.lookup_user_care_taker_bank_account_nameTolookup?.lookupValue || 'Not Available',
      bankAccountNum: assignation.user.user_care_taker?.bank_account_num || 'Not Available',
      bankAccountBeneficiary: assignation.user.user_care_taker?.bank_account_beneficiary || 'Not Available',
    }));

    return {
      response: 200,
      data: responseData,
    };
  } catch (error) {
    console.error("Failed to fetch job assignation details:", error);
    return {
      response: 500,
      message: "An error occurred while fetching job assignation details.",
    };
  }
});
