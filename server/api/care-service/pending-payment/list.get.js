export default defineEventHandler(async (event) => {
  try {
    const assignments = await prisma.jobs_user_assignation.findMany({
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


    // Calculate the sum of job_payment from the joined jobs
    const totalJobPayment = assignments.reduce((sum, assignment) => {
      return sum + (parseInt(assignment.jobs?.job_payment) || parseInt(0)); // Add up all job_payment values
    }, 0);

    return {
      response: 200,
      success: true,
      data: {assignments,totalJobPayment}
    };
  } catch (error) {
    console.error("Error fetching job assignments:", error);
    return {
      response: 500,
      success: false,
      message: "An error occurred while fetching job assignments.",
    };
  }
});
