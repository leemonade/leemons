const pluginName = 'learning-paths';

const permissionNames = {
  learningPaths: `${pluginName}.learning-paths`,
  modules: `${pluginName}.modules`,
};

const permissions = [
  {
    permissionName: permissionNames.learningPaths,
    actions: ['admin', 'create', 'update', 'delete', 'view'],
    localizationName: { es: 'Recorridos educativos', en: 'Learning paths' },
  },
  {
    permissionName: permissionNames.modules,
    actions: ['admin', 'create', 'update', 'delete', 'assign', 'view'],
    localizationName: { es: 'Módulos', en: 'Modules' },
  },
];

/**
 * MENU BUILDER
 */
const menuItems = [
  {
    item: {
      key: 'learningPaths',
      order: 301,
      iconSvg: '/public/learning-paths/menu-icon.svg',
      activeIconSvg: '/public/learning-paths/menu-icon.svg',
      label: {
        es: 'Recorridos educativos',
        en: 'Learning paths',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.learningPaths,
        actionNames: ['view'],
      },
    ],
  },
  // Modules
  {
    item: {
      key: 'learningPaths.modules.new',
      order: 1,
      parentKey: `${pluginName}.learning-paths`,
      url: '/private/learning-paths/modules/new',
      label: {
        es: 'Nuevo módulo',
        en: 'New module',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.modules,
        actionNames: ['create'],
      },
    ],
  },
  {
    item: {
      key: 'learningPaths.modules.library',
      order: 2,
      parentKey: `${pluginName}.learning-paths`,
      url: '/private/learning-paths/modules/library',
      label: {
        es: 'Biblioteca de módulos',
        en: 'Modules library',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.modules,
        actionNames: ['view'],
      },
    ],
  },
];

/*
  === WIDGETS ===
*/
const widgets = {
  items: [
    // --- Class dashboard (module tab) ---
    {
      zoneKey: 'dashboard.class.tabs',
      key: `${pluginName}.class.tab.modules`,
      url: 'dashboard/tab-modules/index',
      properties: {
        label: `${pluginName}.modulesTab.tabName`,
      },
    },
  ],
};

const assignableRoles = [
  {
    role: 'learningpaths.module',
    options: {
      // Not used yet
      dashboardUrl: '/private/learning-paths/modules/dashboard/:id',
      teacherDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      studentDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      evaluationDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      previewUrl: '/private/learning-paths/modules/:id/view',
      creatable: true,
      createUrl: '/private/learning-paths/modules/new',
      canUse: [], // Usable by the plugin owner and assignables plugin
      pluralName: { en: 'modules', es: 'módulos' },
      singularName: { en: 'module', es: 'módulo' },
      order: 6,
      menu: {
        item: {
          iconSvg: '/public/learning-paths/modules-leebrary-icon.svg',
          activeIconSvg: '/public/learning-paths/modules-leebrary-icon.svg',
          label: {
            en: 'Modules',
            es: 'Módulos',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.modules,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'learning-paths',
      listCardComponent: 'ListCard',
      detailComponent: 'Detail',
    },
  },
];

module.exports = {
  pluginName,

  menuItems,
  permissions: {
    permissions,
    permissionNames,
  },

  widgets,
  assignableRoles,
};
