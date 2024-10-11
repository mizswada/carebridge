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
    header: "",
    description: "",
    child: [
      {
        title: "Manage Users",
        path: "/user",
        icon: "ph:user-circle-gear",
        child: [],
        meta: {
          auth: {
            role: ["Superadmin", "Admin"],
          }
        },
        
      },
    ],
  },
  {
    header: "Rehab Center",
    description: "Manage your rehab center",
    child: [
      {
        title: "Category",
        path: "/category",
        icon: "material-symbols:category-search-outline-rounded",
        child: [],
      },
      {
        title: "Pending Approval",
        path: "/category",
        icon: "material-symbols:pending-actions",
        child: [],
      },
      {
        title: "Rehab Center List",
        path: "/category",
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
    header: "Association",
    description: "Manage your association",
    child: [
      {
        title: "Category",
        path: "/category",
        icon: "material-symbols:category-search-outline-rounded",
        child: [],
      },
      {
        title: "Pending Approval",
        path: "/category",
        icon: "material-symbols:pending-actions",
        child: [],
      },
      {
        title: "Association List",
        path: "/category",
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
    header: "Setting",
    description: "Manage your application",
    child: [
      {
        title: "Equipment",
        icon: "ep:tools",
        path: "/emergency-contact",
        external: true,
      },
      {
        title: "Emergency Contact",
        icon: "ri:contacts-book-3-line",
        path: "/emergency-contact",
        external: true,
      },
    ],
    meta: {
      auth: {
        role: ["Superadmin", "Admin"],
      },
    },
  },
];
