export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);

    const { userID, email, roles } = event.context.user;

    // console.log("roles: ", userID);
   
    try { 
        if(roles.includes('Superadmin') || roles.includes('Admin'))
        {
            const associations = await prisma.user_association.count({
                where: {
                    user: {
                        userStatus:  'ACTIVE'
                    }
                },           
            });

            const rehab = await prisma.user_rehab_center.count({
                where: {
                    user: {
                        userStatus:  'ACTIVE'
                    }
                },           
            });

            const caretaker = await prisma.user_care_taker.count({
                where: {
                    user: {
                        userStatus:  'ACTIVE'
                    }
                },           
            });
            
            const customer = await prisma.user_client.count({
                where: {
                    user: {
                        userStatus:  'ACTIVE'
                    }
                },           
            });

            const job = await prisma.jobs.count({});

            const completedJob = await prisma.jobs.count({
                where: {
                    job_status: 'Completed',
                },
                
            });

            const pendings = await prisma.jobs_user_assignation.findMany({
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
                }
            });      
        
            // Calculate the sum of job_payment from the joined jobs
            const pendingPayment = pendings.reduce((sum, assignment) => {
                return sum + (parseInt(assignment.jobs?.job_payment) || parseInt(0)); // Add up all job_payment values
            }, 0);

            const refunds = await prisma.jobs_user_assignation.findMany({
                where: {
                    jobUser_paymentStatus: parseInt(230),
                },
                include: {   
                    jobs:{
                        select :{
                        job_title:true,
                        job_payment:true
                    },
                    },            
                }
            });      
        
            const refundPayment = refunds.reduce((sum, assignment) => {
                return sum + (parseInt(assignment.jobs?.job_payment) || parseInt(0)); // Add up all job_payment values
            }, 0);

            // Get the current year
            const currentYear = new Date().getFullYear();

            // Query to sum jobUser_paymentAmount grouped by month of the current year
            const result = await prisma.jobs_user_assignation.groupBy({
                by: ['jobUser_paymentDate'],
                _sum: {
                    jobUser_paymentAmount: true,
                },
                where: {
                    jobUser_paymentDate: {
                    gte: new Date(`${currentYear}-01-01`), // Start of current year
                    lt: new Date(`${currentYear + 1}-01-01`), // Start of next year (excludes next year's entries)
                    },
                },
            });

            // Initialize an array with 12 slots (one for each month) set to 0
            const monthlyPayment = Array(12).fill(0);

            // Populate the monthly sums array based on the result from the query
            result.forEach((item) => {
                // Extract month from `jobUser_paymentDate` and convert to 0-based index
                const monthIndex = item.jobUser_paymentDate.getMonth(); // getMonth() returns 0 for January, 11 for December
                monthlyPayment[monthIndex] += parseInt(item._sum.jobUser_paymentAmount) || parseInt(0);
            });

            // Query to sum jobUser_paymentAmount grouped by month of the current year
            const result2 = await prisma.jobs.groupBy({
                by: ['created_at'],
                _sum: {
                    job_payment: true,
                },
                where: {
                    created_at: {
                    gte: new Date(`${currentYear}-01-01`), // Start of current year
                    lt: new Date(`${currentYear + 1}-01-01`), // Start of next year (excludes next year's entries)
                    },
                },
            });

            // Initialize an array with 12 slots (one for each month) set to 0
            const monthlyJobPayment = Array(12).fill(0);

            // Populate the monthly sums array based on the result from the query
            result2.forEach((item) => {
                // Extract month from `created_at` and convert to 0-based index
                const monthIndex = item.created_at.getMonth(); // getMonth() returns 0 for January, 11 for December
                monthlyJobPayment[monthIndex] += parseInt(item._sum.job_payment) || parseCookies(0);
            });

            // Step 1: Get the list of userFullNames and their associated userIDs
            const resultAssociation = await prisma.user_association.findMany({
                select: {
                user: {
                    select: {
                    userID: true,
                    userFullName: true, // Select userFullname from the related user table
                    },
                },
                },
            });
        
            // Extract userFullNames and user IDs
            const associationList = resultAssociation.map((item) => item.user.userFullName);
            const associationIds = resultAssociation.map((item) => item.user.userID);
        
            // Step 2: Query the total donation amount for these associations
            const totalDonationResult = await prisma.donation.aggregate({
                _sum: {
                    donation_amount: true,
                },
                where: {
                    donation_association_id: {
                        in: associationIds,
                    },
                    donation_status:parseInt(33)
                },
            });
        
            // Get the total donation amount, or set to 0 if no donations are found
            const totalDonationAmount = parseFloat(totalDonationResult._sum.donation_amount) || 0;
        
            // Step 3: Get the total donation amount per user for calculating percentages
            const donationResults = await prisma.donation.groupBy({
                by: ['donation_association_id'],
                _sum: {
                    donation_amount: true,
                },
                where: {
                    donation_association_id: {
                            in: associationIds,
                        },
                    donation_status:parseInt(33)
                },
            });
        
            // Step 4: Calculate donation percentage for each association
            const donationPercentages = associationIds.map((id) => {
                const donationData = donationResults.find((item) => item.donation_association_id === id);
                const donationAmount = donationData ? parseFloat(donationData._sum.donation_amount) : 0;
        
                // Calculate percentage (avoid division by zero)
                return totalDonationAmount > 0
                ? (donationAmount / totalDonationAmount) * 100
                : 0;
            });

            const jobList = await prisma.jobs.findMany({
                orderBy: {
                    created_at: 'desc', // Sort by created_at in descending order
                },
                take: 5, // Limit to 5 jobs only
            });

            const donationList = await prisma.donation.findMany({
                where: {
                donation_status: parseInt(33), // Filter donations with status 33
                },
                orderBy: {
                created_at: 'desc', // Sort by created_at in descending order
                },
                take: 5, // Limit to 5 donations only
                select: {
                donation_amount: true, // Only get the donation amount from the donation table
                user_donation_donation_user_idTouser: { // Include related user information
                    select: {
                    userFullName: true, // Select the user's full name
                    },
                },
                user_donation_donation_association_idTouser: { // Include association user info
                    select: {
                    userFullName: true, // Assuming the association also has a full name
                    },
                },
                },
            });
            

            return {
                response: 200,
                success: true,
                data: {
                    associations,
                    rehab,
                    caretaker,
                    customer,
                    job,
                    completedJob,
                    pendingPayment,
                    refundPayment,
                    monthlyPayment,
                    monthlyJobPayment,
                    associationList,
                    donationPercentages,
                    jobList,donationList

                },
            };
        }
        else if(roles.includes('Rehab center'))
        {
            const user = await prisma.user.findFirst({
                where: {
                    userEmail:email
                }
            });

            const adsCount = await prisma.advertising.count({
                where: {
                    advertising_user_id: parseInt(user.userID),
                    deleted_at: null,
                },
            });
    
            const activityCount = await prisma.activity.count({
                where: {
                    activity_user_id: parseInt(user.userID),
                    deleted_at: null,
                },
            });
    
            const equipmentCount = await prisma.equipment.count({
                where: {
                    equipment_user_id: parseInt(user.userID),
                    deleted_at: null,
                },
            });

            const equipmentList = await prisma.equipment.findMany({
                where: {
                    equipment_user_id: parseInt(user.userID),
                    deleted_at: null,
                },
                select: {
                    equipment_id: true,
                    equipment_user_id: true, // Select other equipment fields
                    equipment_image: true,
                    equipment_name: true,
                    equipment_description: true,
                    equipment_type: true,
                    equipment_price: true,
                    equipment_pic_name: true,
                    equipment_pic_phoneNum: true,
                    equipment_status: true,
                    created_at: true,
                    
                    // Use the correct relations to get lookup values
                    lookup_equipment_equipment_typeTolookup: {
                        select: {
                            lookupValue: true, // Get the lookup value for equipment_type
                        }
                    },
                    lookup_equipment_equipment_statusTolookup: {
                        select: {
                            lookupValue: true, // Get the lookup value for equipment_status
                        }
                    }
                },
                take:5,
                orderBy: {
                    created_at: 'desc', // Sort by created_at in descending order
                }
            });

            return {
                response: 200,
                success: true,
                data: {
                    adsCount,
                    activityCount,
                    equipmentCount,
                    equipmentList
                },
            };
        }
        else if(roles.includes('Association'))
        {
            
            const totalDonationAmount = await prisma.donation.aggregate({
                _sum: {
                    donation_amount: true,
                },
                where: {
                    donation_association_id: parseInt(userID),
                    donation_status:33,
                    deleted_at: null,
                },
            });
    
            const activityCount = await prisma.activity.count({
                where: {
                    activity_user_id: parseInt(userID),
                    deleted_at: null,
                },
            });
    
            const equipmentCount = await prisma.equipment.count({
                where: {
                    equipment_user_id: parseInt(userID),
                    deleted_at: null,
                },
            });

            const donations = await prisma.donation.findMany({
                where: {
                    donation_association_id: parseInt(userID),
                    deleted_at: null,
                },
                select: {
                    donation_id:true,
                    donation_amount: true,
                    donation_date: true,
                    donation_status: true,
                    donation_reference_number: true,
                    created_at: true,
                    // Fetch the user related to donation_user_id
                    user_donation_donation_user_idTouser: {
                        select: {
                            userFullName: true,
                        },
                    },
                    // Fetch the lookup value related to donation_status
                    lookup: {
                        select: {
                            lookupValue: true,
                        },
                    },
                },
            });

            return {
                response: 200,
                success: true,
                data: {
                    totalDonationAmount: totalDonationAmount._sum.donation_amount | 0,
                    activityCount,
                    equipmentCount,
                    donations
                },
            };

        }
    } catch (error) {
        console.error("Error fetching activities:", error);
        return {
            response: 500,
            success: false,
            error: "Failed to fetch activities",
        };
    }
});
