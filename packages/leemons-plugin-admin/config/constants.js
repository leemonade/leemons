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
      key: 'config',
      order: 0,
      iconSvg: '/public/admin/menu-icon.svg',
      activeIconSvg: '/public/admin/menu-icon.svg',
      url: '/private/admin/setup',
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
  name: 'super-admin',
  description: 'Profile for platform super-administrators',
  indexable: false,
  permissions: [
    {
      permissionName: 'plugins.admin.config',
      actionNames: ['admin'],
    },
    {
      permissionName: 'plugins.users.users',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.users.user-data',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.users.centers',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.users.profiles',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.dataset.dataset',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.calendar.calendar',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.calendar.calendar-configs',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.timetable.config',
      actionNames: ['update'],
    },
    {
      permissionName: 'plugins.timetable.timetable',
      actionNames: ['update'],
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
