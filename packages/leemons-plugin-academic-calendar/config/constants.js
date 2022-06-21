const permissionsPrefix = 'plugins.academic-calendar';

const permissionNames = {
  config: `${permissionsPrefix}.config`,
};

const permissions = [
  {
    permissionName: permissionNames.config,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Calendario Académico', en: 'Academic Calendar' },
  },
];

const permissionsBundles = {
  config: {
    create: {
      permission: permissionNames.config,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.config,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.config,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.config,
      actions: ['delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      order: 5,
      key: 'portfolio-calendar',
      iconSvg: '/public/academic-calendar/menu-icon.svg',
      activeIconSvg: '/public/academic-calendar/menu-icon.svg',
      url: '/private/academic-calendar/config',
      label: {
        en: 'Academic Calendar',
        es: 'Calendario Académico',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.config,
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
