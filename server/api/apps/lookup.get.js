export default defineEventHandler(async (event) => {
  try {


    const states = await prisma.lookup.findMany({
        where: {
            lookupTitle: "state",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const contact_relationships = await prisma.lookup.findMany({
        where: {
            lookupTitle: "contact_relationship",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const nationalities = await prisma.lookup.findMany({
        where: {
            lookupTitle: "nationality_list",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const genders = await prisma.lookup.findMany({
        where: {
            lookupTitle: "gender_type",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    
    const working_hours = await prisma.lookup.findMany({
        where: {
            lookupTitle: "working_hours",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    
    const health_status = await prisma.lookup.findMany({
        where: {
            lookupTitle: "health_status",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const job_additionalCare = await prisma.lookup.findMany({
        where: {
            lookupTitle: "job_additionalCare",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const qualifications_caretaker = await prisma.lookup.findMany({
        where: {
            lookupTitle: "qualifications_caretaker",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const job_category = await prisma.category.findMany({
        where: {
            type: "care_service",
            deleted_at: null,
            status: "Enabled",
        },
        select: {
            category_id: true,
            name: true,
        },
    });

    const rehab_center = await prisma.category.findMany({
        where: {
            type: "rehab_center",
            deleted_at: null,
            status: "Enabled",
        },
        select: {
            category_id: true,
            name: true,
        },
    });

    const marital_status = await prisma.lookup.findMany({
        where: {
            lookupTitle: "marital_status",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const religion = await prisma.lookup.findMany({
        where: {
            lookupTitle: "religion",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const race = await prisma.lookup.findMany({
        where: {
            lookupTitle: "race",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const bank = await prisma.lookup.findMany({
        where: {
            lookupTitle: "bank_name",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const care_servicePrice = await prisma.category.findMany({
        where: {
            type: "care_service",
            deleted_at: null,
            status: "Enabled",
        },
        select: {
            category_id: true,
            name: true,
            charges: true,
            charges_pro: true
        },
    });

    const equipment_type = await prisma.lookup.findMany({
        where: {
            lookupTitle: "equipment_type",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });
    
    const equipment_status = await prisma.lookup.findMany({
        where: {
            lookupTitle: "equipment_status",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
        },
    });

    const job_status = await prisma.lookup.findMany({
        where: {
            lookupTitle: "job_status",
            lookupStatus: "ACTIVE",
        },
        select: {
            lookupID: true,
            lookupValue: true,
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
            job_additionalCare: job_additionalCare,
            qualifications_caretaker: qualifications_caretaker,
            job_category: job_category,
            rehab_center: rehab_center,
            marital_status: marital_status,
            religion: religion,
            race:race,
            bank: bank,
            care_servicePrice: care_servicePrice,
            equipment_type: equipment_type,
            equipment_status: equipment_status,
            job_status:job_status
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