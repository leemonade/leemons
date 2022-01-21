const permissionsPrefix = 'plugins.academic-portfolio';

const permissionNames = {
  portfolio: `${permissionsPrefix}.portfolio`,
  program: `${permissionsPrefix}.program`,
  subjects: `${permissionsPrefix}.subjects`,
  tree: `${permissionsPrefix}.tree`,
};

const permissions = [
  {
    permissionName: permissionNames.portfolio,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Portfolio Académico', en: 'Academic Portfolio' },
  },
  {
    permissionName: permissionNames.program,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Programas educativos', en: 'Learning programs' },
  },
  {
    permissionName: permissionNames.subjects,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Asignaturas', en: 'Subjects' },
  },
  {
    permissionName: permissionNames.tree,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Árbol académico', en: 'Portfolio Tree' },
  },
];

const permissionsBundles = {
  portfolio: {
    create: {
      permission: permissionNames.portfolio,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.portfolio,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.portfolio,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.portfolio,
      actions: ['delete', 'admin'],
    },
  },
  program: {
    create: {
      permission: permissionNames.program,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.program,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.program,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.program,
      actions: ['delete', 'admin'],
    },
  },
  subjects: {
    create: {
      permission: permissionNames.subjects,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.subjects,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.subjects,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.subjects,
      actions: ['delete', 'admin'],
    },
  },
  tree: {
    create: {
      permission: permissionNames.tree,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.tree,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tree,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.tree,
      actions: ['delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'portfolio',
      iconSvg: '/academic-portfolio/menu-icon.svg',
      activeIconSvg: '/academic-portfolio/menu-icon.svg',
      label: {
        en: 'Academic Portfolio',
        es: 'Portfolio Académico',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.portfolio,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'welcome',
      order: 1,
      parentKey: 'portfolio',
      url: '/academic-portfolio/private/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.portfolio,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Learning Program
  {
    item: {
      key: 'program',
      order: 2,
      parentKey: 'portfolio',
      url: '/academic-portfolio/private/program',
      label: {
        en: 'Learning Programs',
        es: 'Programas educativos',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.program,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Subjects
  {
    item: {
      key: 'subjects',
      order: 3,
      parentKey: 'portfolio',
      url: '/academic-portfolio/private/subjects',
      label: {
        en: 'Subjects',
        es: 'Asignaturas',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.subjects,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Tree
  {
    item: {
      key: 'tree',
      order: 2,
      parentKey: 'portfolio',
      url: '/academic-portfolio/private/tree',
      label: {
        en: 'Portfolio Tree',
        es: 'Árbol académico',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.tree,
        actionNames: ['view', 'admin'],
      },
    ],
  },
];

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
};
