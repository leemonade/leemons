const permissionsPrefix = 'tests';

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
    removed: true,
    item: {
      key: 'tests',
      order: 304,
      iconSvg: '/public/tests/menu-icon.svg',
      activeIconSvg: '/public/tests/menu-icon-active.svg',
      label: {
        en: 'Tests',
        es: 'Tests',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.questionBanks,
        actionNames: ['admin'],
      },
      {
        permissionName: permissionNames.tests,
        actionNames: ['admin'],
      },
    ],
  },
  // Tests
  {
    removed: true,
    item: {
      key: 'test',
      order: 2,
      parentKey: `${permissionsPrefix}.tests`,
      url: '/private/tests',
      label: {
        en: 'Tests library',
        es: 'Biblioteca de tests',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tests,
        actionNames: ['admin'],
      },
    ],
  },
  {
    removed: true,
    item: {
      key: 'new-test',
      order: 3,
      parentKey: `${permissionsPrefix}.tests`,
      url: '/private/tests/new',
      label: {
        en: 'New tests',
        es: 'Nuevo test',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tests,
        actionNames: ['admin'],
      },
    ],
  },
  // Question banks
  {
    removed: true,
    item: {
      key: 'questionBanks',
      order: 4,
      parentKey: `${permissionsPrefix}.tests`,
      url: '/private/tests/questions-banks',
      label: {
        en: 'Question banks',
        es: 'Bancos de preguntas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.questionBanks,
        actionNames: ['admin'],
      },
    ],
  },
  {
    removed: true,
    item: {
      key: 'new-questionBanks',
      order: 5,
      parentKey: `${permissionsPrefix}.tests`,
      url: '/private/tests/questions-banks/new',
      label: {
        en: 'New question bank',
        es: 'Nuevo banco de preguntas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.questionBanks,
        actionNames: ['admin'],
      },
    ],
  },
];

const assignableRoles = [
  {
    role: 'tests',
    options: {
      teacherDetailUrl: '/private/tests/detail/:id',
      studentDetailUrl: '/private/tests/student/:id/:user',
      evaluationDetailUrl: '/private/tests/result/:id/:user',
      previewUrl: '/private/tests/detail/:id',
      creatable: true,
      createUrl: '/private/tests/new',
      canUse: [], // Assignables le calza 'calledFrom ('tasks')' y 'assignables'
      pluralName: { en: 'tests', es: 'tests' },
      singularName: { en: 'test', es: 'test' },
      order: 3,
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
            actionNames: ['admin'],
          },
        ],
      },

      componentOwner: 'tests',
      listCardComponent: 'TestsListCard',
      detailComponent: 'TestsDetail',
      type: 'activity',
    },
  },
];

const libraryQuestionBankCategory = {
  key: 'tests-questions-banks',
  creatable: true,
  createUrl: '/private/tests/questions-banks/new',
  duplicable: true,
  provider: 'tests',
  canUse: ['tests'],
  order: 204,
  menu: {
    item: {
      iconSvg: '/public/tests/qb-menu-icon.svg',
      activeIconSvg: '/public/tests/qb-menu-icon.svg',
      label: {
        en: 'Question Banks',
        es: 'Bancos de preguntas',
      },
    },
    permissions: [
      {
        permissionName: 'tests.questionsBanks',
        actionNames: ['admin'],
      },
    ],
  },
  listCardComponent: 'QuestionsBanksListCard',
  detailComponent: 'QuestionsBanksDetail',
  pluralName: { en: 'questions banks', es: 'bancos de preguntas' },
  singularName: { en: 'questions bank', es: 'banco de preguntas' },
};

const QUESTION_TYPES = {
  MAP: 'map',
  MONO_RESPONSE: 'mono-response',
  TRUE_FALSE: 'true-false',
  SHORT_RESPONSE: 'short-response',
  OPEN_RESPONSE: 'open-response',
};

const QUESTION_RESPONSE_STATUS = {
  OK: 'ok',
  KO: 'ko',
  OMITTED: null,
  PARTIAL: 'partial',
  NOT_GRADED: 'not-graded',
};

const widgets = {
  zones: [{ key: `${permissionsPrefix}.qbank.questions.create` }],
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
  assignableRoles,
  libraryQuestionBankCategory,
  QUESTION_TYPES,
  QUESTION_RESPONSE_STATUS,
  widgets,
};
