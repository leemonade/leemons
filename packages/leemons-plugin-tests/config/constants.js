const permissionsPrefix = 'plugins.tests';

const permissionNames = {
  tests: `${permissionsPrefix}.tests`,
  questionBanks: `${permissionsPrefix}.questionsBanks`,
};

const permissions = [
  {
    permissionName: permissionNames.tests,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Tests',
      en: 'Tests',
    },
  },
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
  tests: {
    create: {
      permission: permissionNames.tests,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.tests,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tests,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.tests,
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
      {
        permissionName: permissionNames.tests,
        actionNames: ['view', 'create', 'update', 'delete', 'admin'],
      },
    ],
  },
  // Tests
  {
    item: {
      key: 'test',
      order: 1,
      parentKey: 'tests',
      url: '/private/tests',
      label: {
        en: 'Tests',
        es: 'Tests',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tests,
        actionNames: ['view', 'create', 'update', 'delete', 'admin'],
      },
    ],
  },
  // Question banks
  {
    item: {
      key: 'questionBanks',
      order: 2,
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

const assignableRoles = [
  {
    role: 'tests',
    options: {
      teacherDetailUrl: '/private/tests/detail/:id',
      studentDetailUrl: '/',
      teacherEvaluationUrl: '/',
      creatable: true,
      createUrl: '/private/tests/new',
      canUse: [], // Assignables le calza 'calledFrom ('plugins.tasks')' y 'plugins.assignables'
      menu: {
        item: {
          iconSvg: '/public/tests/menu-icon.svg',
          activeIconSvg: '/public/tests/menu-icon.svg',
          label: {
            en: 'Tests',
            es: 'Tests',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.tests,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'plugins.tests',
      listCardComponent: 'TestsListCard',
      detailComponent: 'TestsDetail',
    },
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
  assignableRoles,
};
