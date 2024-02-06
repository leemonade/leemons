const permissionsPrefix = 'feedback';

const permissionNames = {
  feedback: `${permissionsPrefix}.feedback`,
};

const permissions = [
  {
    permissionName: permissionNames.feedback,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Feedback',
      en: 'Feedback',
    },
  },
];

const menuItems = [
  // Main
  {
    removed: true,
    item: {
      key: 'feedback',
      order: 305,
      iconSvg: '/public/feedback/menu-icon-active.svg',
      activeIconSvg: '/public/feedback/menu-icon-active.svg',
      label: {
        en: 'Surveys',
        es: 'Encuestas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.feedback,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // List
  {
    removed: true,
    item: {
      key: 'feedback-list',
      order: 2,
      parentKey: `${permissionsPrefix}.feedback`,
      url: '/private/feedback',
      label: {
        en: 'Feedback library',
        es: 'Biblioteca de encuestas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.feedback,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // New
  {
    removed: true,
    item: {
      key: 'feedback-new',
      order: 3,
      parentKey: `${permissionsPrefix}.feedback`,
      url: '/private/feedback/new',
      label: {
        en: 'New survey',
        es: 'Nueva encuesta',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.feedback,
        actionNames: ['create', 'admin'],
      },
    ],
  },
];

const assignableRoles = [
  {
    role: 'feedback',
    options: {
      teacherDetailUrl: '/private/feedback/detail/:id',
      studentDetailUrl: '/private/feedback/student/:id/:user',
      evaluationDetailUrl: '/private/feedback/result/:id/:user',
      dashboardUrl: '/private/feedback/result/:id',
      creatable: true,
      createUrl: '/private/feedback/new',
      canUse: [], // Assignables le calza 'calledFrom ('tasks')' y 'assignables'
      pluralName: { en: 'surveys', es: 'encuestas' },
      singularName: { en: 'survey', es: 'encuesta' },
      order: 5,
      menu: {
        item: {
          iconSvg: '/public/feedback/menu-icon.svg',
          activeIconSvg: '/public/feedback/menu-icon-active.svg',
          label: {
            en: 'Surveys',
            es: 'Encuestas',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.feedback,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'feedback',
      listCardComponent: 'FeedbackListCard',
      detailComponent: 'FeedbackDetail',
      type: 'activity',
    },
  },
];

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
  assignableRoles,
};
