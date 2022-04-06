const permissionsPrefix = 'plugins.tests';

const permissionNames = {
  questionBanks: `${permissionsPrefix}.questionsBanks`,
};

const permissions = [
  {
    permissionName: permissionNames.questionBanks,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Tests - Bancos de preguntas',
      en: 'Tests - Questions banks',
    },
  },
];

const permissionsBundles = {
  questionBanks: {
    create: {
      permission: permissionNames.questionBanks,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.questionBanks,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.questionBanks,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.questionBanks,
      actions: ['delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'tests',
      iconSvg: '/public/tests/menu-icon.svg',
      activeIconSvg: '/public/tests/menu-icon.svg',
      label: {
        en: 'Tests',
        es: 'Tests',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.questionBanks,
        actionNames: ['view', 'create', 'update', 'delete', 'admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'questionBanks',
      order: 1,
      parentKey: 'tests',
      url: '/private/tests/questions-banks',
      label: {
        en: 'Questions banks',
        es: 'Bancos de preguntas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.questionBanks,
        actionNames: ['view', 'create', 'update', 'delete', 'admin'],
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
