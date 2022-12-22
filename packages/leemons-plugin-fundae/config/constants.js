const permissionsPrefix = 'plugins.fundae';

const permissionNames = {
  fundae: `${permissionsPrefix}.fundae`,
};

const permissions = [
  {
    permissionName: permissionNames.fundae,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Fundae',
      en: 'Fundae ',
    },
  },
];

const menuItems = [
  // Main
  {
    item: {
      key: 'fundae',
      order: 101,
      iconSvg: '/public/fundae/menu-icon.svg',
      activeIconSvg: '/public/fundae/menu-icon-active.svg',
      label: {
        en: 'Fundae management',
        es: 'Gestión fundae',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.fundae,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // List
  {
    item: {
      key: 'fundae-list',
      order: 2,
      parentKey: 'fundae',
      url: '/private/fundae/reports',
      label: {
        en: 'Configuration and reporting',
        es: 'Configuración e informes',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.fundae,
        actionNames: ['view', 'admin'],
      },
    ],
  },
];

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
};
