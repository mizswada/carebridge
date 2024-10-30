import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {

    // Retrieve the token from the Authorization header
    const authHeader = event.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 400,
        message: "Authorization header is missing or invalid",
      };
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.auth.secretAccess); // Replace with your actual secret

    console.log("decodedToken: ",decodedToken)


    // Extract the userID from the token payload
    const userID = decodedToken.userID;
    const roles = decodedToken.roles;
    console.log("userID: ",userID)

    const user = await prisma.user.findFirst({
      where: {
        userID: parseInt(userID),
      },
    });

    if (roles.includes("Caretaker")) {
      // Define the start and end of today for filtering by today's date
      const todayStart = DateTime.now().startOf('day').toISO(); // Start of today (e.g., "2024-10-28T00:00:00.000Z")
      const todayEnd = DateTime.now().endOf('day').toISO();     // End of today (e.g., "2024-10-28T23:59:59.999Z")

      console.log("startOfDay", todayStart);
      console.log("endOfDay", todayEnd);

      const todayServices = await prisma.jobs.findMany({
        where: {
            jobs_user_assignation: {
              some: {
                  jobUser_userID: userID, // Filter by assigned user
              }
            },
            job_date: {
              gte: todayStart,  // Greater than or equal to start of today
              lte: todayEnd,    // Less than or equal to end of today
            },
            //job_status: "ASSIGN", // Filter for active jobs if applicable
        },
        select: {
            job_title: true, // Service Name
            job_date: true,  // Date
            job_time: true,  // Time
            job_notes: true,
            user: {
                select: {
                    userFullName: true, // User Name
                    userPhone: true,    // Phone Number
                },
            },
            category: {
                select: {
                    name: true, // Service Type (assuming `name` is the category name)
                },
            },

        },
        orderBy: {
          job_time: 'asc', // Sort by upcoming date
        }
      });

      const todayServicesData = todayServices.map(service => ({
        title: service.job_title,
        serviceType: service.category?.name || "Unknown",
        dateTime: `${service.job_date.toLocaleDateString()} ${service.job_time?.toLocaleTimeString()}`,
        name: service.user?.userFullName || "N/A", // Get assigned user name
        phoneNumber: service.user?.userPhone || "N/A", // Get assigned user phone
      }));

      const upcomingServices = await prisma.jobs.findMany({
        where: {
            jobs_user_assignation: {
              some: {
                  jobUser_userID: userID, // Filter by assigned user
              }
            },
            job_date: {
                gte: DateTime.now().toJSDate(), // Only future dates
            },
            job_status: "ASSIGN", // Filter for active jobs if applicable
        },
        select: {
            job_title: true, // Service Name
            job_date: true,  // Date
            job_time: true,  // Time
            job_notes: true,
            user: {
                select: {
                    userFullName: true, // User Name
                    userPhone: true,    // Phone Number
                },
            },
            category: {
                select: {
                    name: true, // Service Type (assuming `name` is the category name)
                },
            },
        },
        orderBy: {
            job_date: 'asc', // Sort by upcoming date
        }
      });

      const upcomingServicesData = upcomingServices.map(service => ({
        title: service.job_title,
        serviceType: service.category?.name || "Unknown",
        dateTime: `${service.job_date.toLocaleDateString()} ${service.job_time?.toLocaleTimeString()}`,
        name: service.user?.userFullName || "N/A", // Get assigned user name
        phoneNumber: service.user?.userPhone || "N/A", // Get assigned user phone
      }));

      const emergency_contact = await prisma.user_care_taker.findFirst({
          where: {
              user_id: parseInt(userID),
          },
          select: {
              emergency_contact_name: true,
              emergency_contact_relationship: true,
              emergency_contact_number: true,
          },
      });

      return {
        statusCode: 200,
        data: {
          userName: user.userFullName,
          todayServicesData: todayServicesData,
          upcomingServicesData:upcomingServicesData,
          emergency_contact: emergency_contact            
        },
      };
    }
    else {

      const upcomingServices = await prisma.jobs.findMany({
        where: {
            job_user_id: userID,
            job_date: {
                gte: DateTime.now().toJSDate(), // Only future dates
            },
            job_status: "ASSIGN", // Filter for active jobs if applicable
        },
        select: {
            job_title: true, // Service Name
            job_date: true,  // Date
            job_time: true,  // Time
            category: {
                select: {
                    name: true, // Service Type (assuming `name` is the category name)
                },
            },
            jobs_user_assignation: {
              select: {
                  user: {
                      select: {
                          userFullName: true, // Assigned user's name
                          userPhone: true,     // Assigned user's phone number
                      },
                  },
              },
          },
        },
        orderBy: {
            job_date: 'asc', // Sort by upcoming date
        }
      });

      const upcomingServicesData = upcomingServices.map(service => ({
        title: service.job_title,
        serviceType: service.category?.name || "Unknown",
        dateTime: `${service.job_date.toLocaleDateString()} ${service.job_time?.toLocaleTimeString()}`,
        name: service.jobs_user_assignation[0]?.user?.userFullName || "N/A", // Get assigned user name
        phoneNumber: service.jobs_user_assignation[0]?.user?.userPhone || "N/A", // Get assigned user phone
      }));

      const recentServices = await prisma.jobs.findMany({
        where: {
            job_user_id: userID, // Jobs created by the authenticated user
            job_date: {
                lt: DateTime.now().toJSDate(), // Only past dates
            },
            job_status: "COMPLETED", // Filter for completed jobs if applicable
        },
        select: {
            job_title: true, // Job Title
            category: {
                select: {
                    name: true, // Service Type
                },
            },
            jobs_user_assignation: {
                select: {
                    user: {
                        select: {
                            userFullName: true, // Assigned user's name
                            userPhone: true,     // Assigned user's phone number
                        },
                    },
                    jobUser_rating: true, // Rating for the service
                },
            },
        },
        orderBy: {
            job_date: 'desc', // Sort by recent date
        }
      });

      // Format the response data
      const recentServicesData = recentServices.map(service => ({
          jobTitle: service.job_title,
          serviceType: service.category?.name || "Unknown",
          rating: service.jobs_user_assignation[0]?.jobUser_rating || "N/A", // Get service rating
          name: service.jobs_user_assignation[0]?.user?.userFullName || "N/A", // Get assigned user name
          phoneNumber: service.jobs_user_assignation[0]?.user?.userPhone || "N/A", // Get assigned user phone
      }));

      const emergency_contacts = await prisma.emergency_contacts.findMany({
          where: {
              contact_user_id: parseInt(userID),
          },
          select: {
              contact_name: true,
              contact_relationship: true,
              contact_phone_number: true,
          },
      });

      if (!emergency_contacts) {
          return {
            statusCode: 404,
            message: "Data does not exist",
          };
      }

      return {
        statusCode: 200,
        data: {
          userName: user.userFullName,
            upcomingServicesData: upcomingServicesData,
            recentServicesData: recentServicesData,
            emergency_contacts: emergency_contacts,
            
        },
      };
    }


} catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
          statusCode: 400,
          message: "Your session has expired. Please log in again.",
      };
    }
    console.log(error);
    return {
      statusCode: 500,
      //message: "Internal server error",
      message: error.message,
    };
  }
});