export default defineEventHandler(async (event) => {
  try {


    const states = await prisma.lookup.findMany({
        where: {
            lookupTitle: "state",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const contact_relationships = await prisma.lookup.findMany({
        where: {
            lookupTitle: "contact_relationship",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const nationalities = await prisma.lookup.findMany({
        where: {
            lookupTitle: "nationality_list",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const genders = await prisma.lookup.findMany({
        where: {
            lookupTitle: "gender_type",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    
    const working_hours = await prisma.lookup.findMany({
        where: {
            lookupTitle: "working_hours",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    
    const health_status = await prisma.lookup.findMany({
        where: {
            lookupTitle: "health_status",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const job_stayin = await prisma.lookup.findMany({
        where: {
            lookupTitle: "job_stayin",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const qualifications_caretaker = await prisma.lookup.findMany({
        where: {
            lookupTitle: "qualifications_caretaker",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const job_category = await prisma.category.findMany({
        where: {
            type: "care_service",
        },
        select: {
            category_id: true,
            name: true,
        },
    });

    const rehab_center = await prisma.category.findMany({
        where: {
            type: "rehab_center",
        },
        select: {
            category_id: true,
            name: true,
        },
    });


    return {
        statusCode: 200,
        data: {
            states: states,
            contact_relationships: contact_relationships,
            nationalities: nationalities,
            genders: genders,
            working_hours: working_hours, 
            health_status: health_status, 
            job_stayin: job_stayin,
            qualifications_caretaker: qualifications_caretaker,
            job_category: job_category,
            rehab_center: rehab_center
        },
    };

} catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      //message: "Internal server error",
      message: error.message,
    };
  }
});