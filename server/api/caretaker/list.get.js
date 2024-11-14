export default defineEventHandler(async (event) => {
  try {
    // Fetch users who have userRoleRoleID == 6 and userStatus != 'DELETED'
    const usersWithRole = await prisma.userrole.findMany({
      where: {
        userRoleRoleID: 6,  // Filter by userRoleRoleID
        user: {
          userStatus:  'ACTIVE'
        },
      },
      include: {
        user: {  // Join and include user details
          select: {
            userID: true,
            userUsername: true,
            userFullName: true,
            userEmail: true,
            userPhone: true,
            userStatus: true,
            userCreatedDate: true,
          },
        },
      },
    });

    // Map the data to format it as desired in the response
    const user = usersWithRole.map((role) => ({
      id: role.user.userID,
      username: role.user.userUsername,
      fullName: role.user.userFullName,
      email: role.user.userEmail,
      phone: role.user.userPhone,
      status: role.user.userStatus,
      createdDate: role.user.userCreatedDate,
    }));

    // Return formatted data
    return {
      response: 200,
      success: true,
      data: { user },
    };
  } catch (error) {
    console.error("Error fetching users with role:", error);
    return {
      response: 500,
      success: false,
      error: "Failed to fetch users with role",
    };
  }
});
