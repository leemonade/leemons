const permissionsPrefix = 'plugins.grades';

const permissionNames = {
  rules: `${permissionsPrefix}.rules`,
  evaluations: `${permissionsPrefix}.evaluations`,
  promotions: `${permissionsPrefix}.promotions`,
  dependencies: `${permissionsPrefix}.dependencies`,
};

const permissions = [
  {
    permissionName: permissionNames.rules,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Reglas Académicas', en: 'Academic Rules' },
  },
  {
    permissionName: permissionNames.evaluations,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Reglas Académicas - Evaluaciones',
      en: 'Academic Rules - Evaluations',
    },
  },
  {
    permissionName: permissionNames.promotions,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Reglas Académicas - Promociones',
      en: 'Academic Rules - Promotions',
    },
  },
  {
    permissionName: permissionNames.dependencies,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Reglas Académicas - Dependencias',
      en: 'Academic Rules - Dependencies',
    },
  },
];

const permissionsBundles = {
  rules: {
    create: {
      permission: permissionNames.rules,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.rules,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.rules,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.rules,
      actions: ['delete', 'admin'],
    },
  },
  evaluations: {
    create: {
      permission: permissionNames.evaluations,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.evaluations,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.evaluations,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.evaluations,
      actions: ['delete', 'admin'],
    },
  },
  promotions: {
    create: {
      permission: permissionNames.promotions,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.promotions,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.promotions,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.promotions,
      actions: ['delete', 'admin'],
    },
  },
  dependencies: {
    create: {
      permission: permissionNames.dependencies,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.dependencies,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.dependencies,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.dependencies,
      actions: ['delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'rules',
      order: 101,
      iconSvg: '/public/grades/menu-icon.svg',
      activeIconSvg: '/public/grades/menu-icon.svg',
      label: {
        en: 'Academic Rules',
        es: 'Reglas Académicas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.rules,
        actionNames: ['admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'welcome',
      order: 1,
      parentKey: 'rules',
      url: '/private/grades/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.rules,
        actionNames: ['admin'],
      },
    ],
  },
  // Evaluation System
  {
    item: {
      key: 'evaluations',
      order: 2,
      parentKey: 'rules',
      url: '/private/grades/evaluations',
      label: {
        en: 'Evaluation system',
        es: 'Sistemas de evaluación',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.evaluations,
        actionNames: ['admin'],
      },
    ],
  },
  // Promotion rules
  {
    item: {
      key: 'promotions',
      order: 3,
      parentKey: 'rules',
      url: '/private/grades/promotions',
      label: {
        en: 'Promotion rules',
        es: 'Reglas de promoción',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.promotions,
        actionNames: ['admin'],
      },
    ],
  },
  // Dependencies
  {
    item: {
      key: 'dependencies',
      order: 4,
      parentKey: 'rules',
      url: '/private/grades/dependencies',
      label: {
        en: 'Dependencies',
        es: 'Dependencias',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.dependencies,
        actionNames: ['admin'],
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
