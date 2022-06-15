const permissionsPrefix = 'plugins.admin';

const permissionNames = {
  config: `${permissionsPrefix}.config`,
};

const permissions = [
  {
    permissionName: permissionNames.config,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Configuración', en: 'Config' },
  },
];

const permissionsBundles = {
  config: {
    all: {
      permission: permissionNames.config,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      order: 1,
      key: 'config',
      iconSvg: '/public/admin/menu-icon.svg',
      activeIconSvg: '/public/admin/menu-icon.svg',
      label: {
        en: 'Config',
        es: 'Configuración',
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

const profileSettings = {
  name: 'SuperAdmin',
  description: 'Profile for platform super-administrators',
  permissions: [
    {
      permissionName: 'plugins.users.users',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.users.user-data',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.users.centers',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.users.profiles',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.dataset.dataset',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.calendar.calendar',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.timetable.config',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.timetable.timetable',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.leebrary.library',
      actionNames: ['admin'],
    },
  ],
};

const STATUS = {
  NONE: 'NONE',
  LOCALIZED: 'LOCALIZED',
  INSTALLED: 'INSTALLED',
  ADMIN_CREATED: 'ADMIN_CREATED',
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
  profileSettings,
  STATUS,
};
