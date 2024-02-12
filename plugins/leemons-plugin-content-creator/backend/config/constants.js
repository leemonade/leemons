const permissionsPrefix = 'content-creator';

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
    removed: true,
    item: {
      key: 'content-creator',
      order: 302,
      iconSvg: '/public/content-creator/menu-icon-active.svg',
      activeIconSvg: '/public/content-creator/menu-icon-active.svg',
      label: {
        en: 'Documents',
        es: 'Documentos',
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
    removed: true,
    item: {
      key: 'content-creator-library',
      order: 2,
      parentKey: `${permissionsPrefix}.content-creator`,
      url: '/private/content-creator',
      label: {
        en: 'Documents library',
        es: 'Biblioteca de documentos',
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
    removed: true,
    item: {
      key: 'content-creator-new',
      order: 3,
      parentKey: `${permissionsPrefix}.content-creator`,
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
      studentDetailUrl: '/private/content-creator/view/:id/:user',
      evaluationDetailUrl: '/private/content-creator/view/:id/:user',
      previewUrl: '/private/content-creator/:id/view',
      creatable: true,
      order: 1,
      createUrl: '/private/content-creator/new',
      canUse: [], // Assignables le calza 'calledFrom ('tasks')' y 'assignables'
      pluralName: { en: 'documents', es: 'documentos' },
      singularName: { en: 'document', es: 'documento' },
      menu: {
        item: {
          iconSvg: '/public/content-creator/menu-icon-active.svg',
          activeIconSvg: '/public/content-creator/menu-icon-active.svg',
          label: {
            en: 'Documents',
            es: 'Documentos',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.creator,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'content-creator',
      listCardComponent: 'DocumentListCard',
      detailComponent: 'DocumentDetail',
      playerComponent: 'DocumentPlayer',
      type: 'resource',
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
