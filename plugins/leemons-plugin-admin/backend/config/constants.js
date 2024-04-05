const permissionsPrefix = 'admin';

const permissionNames = {
  setup: `${permissionsPrefix}.setup`,
};

const permissions = [
  {
    permissionName: permissionNames.setup,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Configuración', en: 'Config' },
  },
];

const permissionsBundles = {
  setup: {
    all: {
      permission: permissionNames.setup,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'setup',
      order: 0,
      iconSvg: '/public/admin/menu-icon.svg',
      activeIconSvg: '/public/admin/menu-icon.svg',
      url: '/private/admin/setup',
      label: {
        en: 'Setup',
        es: 'Configuración',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.setup,
        actionNames: ['admin'],
      },
    ],
  },
];

const profileSettings = {
  name: 'SuperAdmin',
  sysName: 'super',
  description: 'Profile for platform super-administrators',
  indexable: false,
  permissions: [
    {
      permissionName: 'admin.setup',
      actionNames: ['admin'],
    },
    {
      permissionName: 'users.users',
      actionNames: ['update'],
    },
    {
      permissionName: 'users.user-data',
      actionNames: ['update'],
    },
    {
      permissionName: 'users.centers',
      actionNames: ['update'],
    },
    {
      permissionName: 'users.profiles',
      actionNames: ['update'],
    },
    {
      permissionName: 'dataset.dataset',
      actionNames: ['update'],
    },
    {
      permissionName: 'calendar.calendar',
      actionNames: ['update'],
    },
    {
      permissionName: 'calendar.calendar-configs',
      actionNames: ['update'],
    },
    {
      permissionName: 'timetable.config',
      actionNames: ['update'],
    },
    {
      permissionName: 'timetable.timetable',
      actionNames: ['update'],
    },
    {
      permissionName: 'leebrary.library',
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

const widgets = {
  zones: [{ key: `${permissionsPrefix}.admin-page` }],
  items: [],
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
  widgets,
  PLUGIN_NAME: permissionsPrefix,
};
