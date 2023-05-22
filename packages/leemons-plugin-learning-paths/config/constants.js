const pluginName = 'plugins.learning-paths';

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
    actions: ['admin', 'create', 'update', 'delete', 'view'],
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
      parentKey: 'learningPaths',
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
      parentKey: 'learningPaths',
      url: '/private/learning-paths/modules/library',
      label: {
        es: 'Librería de módulos',
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
      zoneKey: 'plugins.dashboard.class.tabs',
      key: `${pluginName}.class.tab.modules`,
      url: 'dashboard/tab-modules/index',
      properties: {
        label: `${pluginName}.modulesTab.tabName`,
      },
    },
  ],
};

module.exports = {
  pluginName,

  menuItems,
  permissions: {
    permissions,
    permissionNames,
  },

  widgets,
};
