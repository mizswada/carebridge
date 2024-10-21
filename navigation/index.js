export default [
  {
    header: "",
    description: "",
    child: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "ic:outline-dashboard",
        child: [],
        meta: {},
      },
    ],
  },
  // {
  //   header: "",
  //   description: "",
  //   child: [
  //     {
  //       title: "Manage Users",
  //       path: "/user",
  //       icon: "ph:user-circle-gear",
  //       child: [],
  //       meta: {
  //         auth: {
  //           role: ["Superadmin", "Admin"],
  //         }
  //       },
        
  //     },
  //   ],
  // },
  /* {
    header: "Administration",
    description: "Manage your application",
    child: [
      {
        title: "Configuration",
        icon: "ic:outline-settings",
        child: [
          {
            title: "Environment",
            path: "/devtool/config/environment",
          },
        ],
      },
      {
        title: "Menu Editor",
        icon: "ci:menu-alt-03",
        path: "/devtool/menu-editor",
        child: [],
      },
      {
        title: "Manage Users",
        path: "/devtool/user-management",
        icon: "ph:user-circle-gear",
        child: [
          {
            title: "User List",
            path: "/devtool/user-management/user-list",
            icon: "",
            child: [],
          },
          {
            title: "Role List",
            path: "/devtool/user-management/role-list",
            icon: "",
            child: [],
          },
        ],
      },
      {
        title: "Content",
        icon: "mdi:pencil-ruler",
        child: [
          {
            title: "Editor",
            path: "/devtool/content-editor",
          },
          {
            title: "Template",
            path: "/devtool/content-editor/template",
          },
        ],
      },
      {
        title: "API Editor",
        path: "/devtool/api-editor",
        icon: "material-symbols:api-rounded",
        child: [],
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin"],
      },
    },
  }, */
  /* {
    header: "Help",
    description: "Help and documentation",
    child: [
      {
        title: "Documentation",
        icon: "solar:book-bookmark-minimalistic-bold",
        path: "https://mawar-cms-docs.vercel.app",
        external: true,
      },
      {
        title: "UI Components",
        icon: "material-symbols:settings-input-component-outline-rounded",
        path: "https://corradui.datasc.dev",
        external: true,
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin"],
      },
    },
  }, */
  {
    header: "Association",
    description: "",
    child: [
      {
        title: "Activity",
        path: "/association/activity",
        icon: "material-symbols:list-alt-check",
        child: [],
        meta: {
          auth: {
            role: ["Association"],
          }
        },        
      },
      {
        title: "Donation",
        path: "/association/donation",
        icon: "bxs:donate-heart",
        child: [],
        meta: {
          auth: {
            role: ["Association"],
          }
        },        
      },
      {
        title: "Equipment",
        path: "/association/equipment",
        icon: "ep:tools",
        child: [],
        meta: {
          auth: {
            role: ["Association"],
          }
        },        
      }
    ],
    meta: {
      auth: {
        role: ["Association"],
      }
    },
  },
  {
    header: "Rehab Center",
    description: "",
    child: [
      {
        title: "Activity",
        path: "/rehab-center/activity",
        icon: "material-symbols:list-alt-check",
        child: [],
        meta: {
          auth: {
            role: ["Rehab center"],
          }
        },        
      },
      {
        title: "Equipment",
        path: "/rehab-center/equipment",
        icon: "ep:tools",
        child: [],
        meta: {
          auth: {
            role: ["Rehab center"],
          }
        },        
      }
    ],
    meta: {
      auth: {
        role: ["Rehab center"],
      }
    },
  },
  
  {
    header: "Rehab Center",
    description: "Manage your rehab center",
    child: [
      {
        title: "Category",
        path: "/rehab-center/category",
        icon: "material-symbols:category-search-outline-rounded",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
      },
      {
        title: "Pending Approval",
        path: "/rehab-center/pending",
        icon: "material-symbols:pending-actions",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
      },
      {
        title: "Rehab Center List",
        path: "/rehab-center/list",
        icon: "material-symbols-light:lists",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin", "Admin"],
      },
    },
  },
  {
    header: "Association",
    description: "Manage your association",
    child: [
      {
        title: "Category",
        path: "/association/category",
        icon: "material-symbols:category-search-outline-rounded",
        child: [],
      },
      {
        title: "Pending Approval",
        path: "/association/pending",
        icon: "material-symbols:pending-actions",
        child: [],
      },
      {
        title: "Association List",
        path: "/association/list",
        icon: "material-symbols-light:lists",
        child: [],
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin", "Admin"],
      },
    },
  },
  {
    header: "Care Service",
    description: "Manage your care service",
    child: [
      {
        title: "Category",
        path: "/category",
        icon: "material-symbols:category-search-outline-rounded",
        child: [],
      },
      {
        title: "Service List",
        path: "/category",
        icon: "material-symbols-light:lists",
        child: [],
      },
      {
        title: "Payment",
        path: "/category",
        icon: "material-symbols:payments-rounded",
        child: [],
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin", "Admin"],
      },
    },
  },
  {
    header: "User",
    description: "Manage your users",
    child: [
      {
        title: "Admin",
        path: "/admin",
        icon: "clarity:administrator-solid",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
        
      },
      {
        title: "Caretaker",
        path: "/caretaker",
        icon: "hugeicons:healtcare",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
        
      },
      {
        title: "Customer",
        path: "/customer",
        icon: "carbon:customer",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
        
      },
      // {
      //   title: "Equipment",
      //   icon: "ep:tools",
      //   path: "/emergency-contact",
      //   external: true,
      // },
      // {
      //   title: "Emergency Contact",
      //   icon: "ri:contacts-book-3-line",
      //   path: "/emergency-contact",
      //   external: true,
      // },
    ],
    meta: {
      auth: {
        role: ["Superadmin", "Admin"],
      },
    },
  },
];
