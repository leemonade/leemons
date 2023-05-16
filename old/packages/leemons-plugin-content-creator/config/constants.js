const permissionsPrefix = 'plugins.content-creator';

const permissionNames = {
  creator: `${permissionsPrefix}.creator`,
};

const permissions = [
  {
    permissionName: permissionNames.creator,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Creador de contenidos',
      en: 'Content creator',
    },
  },
];

const menuItems = [
  // Main
  {
    item: {
      key: 'content-creator',
      order: 302,
      iconSvg: '/public/content-creator/menu-icon-active.svg',
      activeIconSvg: '/public/content-creator/menu-icon-active.svg',
      label: {
        en: 'Content creator',
        es: 'Creador de contenidos',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // List
  {
    item: {
      key: 'content-creator-library',
      order: 2,
      parentKey: 'content-creator',
      url: '/private/content-creator',
      label: {
        en: 'Documents library',
        es: 'Librería de documentos',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // New
  {
    item: {
      key: 'content-creator-new',
      order: 3,
      parentKey: 'content-creator',
      url: '/private/content-creator/new',
      label: {
        en: 'New document',
        es: 'Nuevo documento',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['create', 'admin'],
      },
    ],
  },
];

const assignableRoles = [
  {
    role: 'content-creator',
    options: {
      teacherDetailUrl: '/private/content-creator/detail/:id',
      studentDetailUrl: '/private/content-creator/view/:id',
      evaluationDetailUrl: '/private/content-creator/result/:id/:user',
      dashboardUrl: '/private/content-creator/result/:id',
      creatable: true,
      createUrl: '/private/content-creator/new',
      canUse: [], // Assignables le calza 'calledFrom ('plugins.tasks')' y 'plugins.assignables'
      pluralName: { en: 'contents', es: 'contenidos' },
      singularName: { en: 'content', es: 'contenido' },
      menu: {
        item: {
          iconSvg: '/public/content-creator/menu-icon-active.svg',
          activeIconSvg: '/public/content-creator/menu-icon-active.svg',
          label: {
            en: 'Content creator',
            es: 'Creador de contenidos',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.creator,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'plugins.content-creator',
      listCardComponent: 'DocumentListCard',
      detailComponent: 'DocumentDetail',
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
