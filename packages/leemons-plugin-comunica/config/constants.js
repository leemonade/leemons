const permissionsPrefix = 'plugins.comunica';

const permissionNames = {
  config: `${permissionsPrefix}.config`,
};

const permissions = [
  {
    permissionName: permissionNames.config,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Configuración comunica', en: 'Comunica config' },
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
      order: 102,
      key: 'comunica',
      iconSvg: '/public/comunica/menu-icon.svg',
      url: '/private/comunica/config',
      activeIconSvg: '/public/comunica/menu-icon-active.svg',
      label: { es: 'Configuración comunica', en: 'Comunica config' },
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
