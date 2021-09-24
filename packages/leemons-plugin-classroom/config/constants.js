const permissionsPrefix = 'plugins.classroom';

const permissionNames = {
  tree: `${permissionsPrefix}.tree`,
  organization: `${permissionsPrefix}.organization`,
  adminView: `${permissionsPrefix}.adminview`,
  classroom: `${permissionsPrefix}.classroom`,
};

const permissions = [
  {
    permissionName: permissionNames.tree,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Clases - Árbol', en: 'Classroom - Tree' },
  },
  {
    permissionName: permissionNames.organization,
    actions: ['view', 'update', 'create', 'assign', 'delete', 'admin'],
    localizationName: { es: 'Clases - Organización', en: 'Classroom - Organization' },
  },
  {
    permissionName: permissionNames.adminView,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Clases - Admin', en: 'Classroom - Admin' },
  },
  {
    permissionName: permissionNames.classroom,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Clases', en: 'Classroom' },
  },
];

const permissionsBundles = {
  tree: {
    create: {
      permission: permissionNames.tree,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.tree,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tree,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.tree,
      actions: ['delete', 'admin'],
    },
    assignables: [
      {
        permission: permissionNames.tree,
        actions: ['update', 'admin'],
      },
      {
        permission: 'plugins.users.profiles',
        actions: ['view', 'admin'],
      },
    ],
  },
  organization: {
    create: {
      permission: permissionNames.organization,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.organization,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.organization,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.organization,
      actions: ['delete', 'admin'],
    },
    assignUsers: [
      {
        permission: permissionNames.organization,
        actions: ['view', 'admin'],
      },
      {
        permission: permissionNames.organization,
        actions: ['assign', 'admin'],
      },
      {
        permission: 'plugins.users.users',
        actions: ['view', 'admin'],
      },
    ],
    viewUsers: [
      {
        permission: permissionNames.organization,
        actions: ['view', 'admin'],
      },
      {
        permission: 'plugins.users.users',
        actions: ['view', 'admin'],
      },
    ],
  },
  user: {
    view: {
      permission: 'plugins.users.users',
      actions: ['view'],
    },
  },
  profiles: {
    view: {
      permission: 'plugins.users.profiles',
      actions: ['view', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'classroom',
      iconSvg: '/classroom/classroom.svg',
      activeIconSvg: '/classroom/classroomActive.svg',
      label: {
        en: 'Classroom',
        es: 'Clases',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.classroom,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'welcome',
      order: 1,
      parentKey: 'classroom',
      url: '/classroom/private/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.classroom,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Tree
  {
    item: {
      key: 'tree',
      order: 2,
      parentKey: 'classroom',
      url: '/classroom/private/tree',
      label: {
        en: 'Tree',
        es: 'Árbol',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.tree,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Organization
  {
    item: {
      key: 'organization',
      order: 3,
      parentKey: 'classroom',
      url: '/classroom/private/organization',
      label: {
        en: 'Organization',
        es: 'Organización',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.organization,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Classes
  {
    item: {
      key: 'classes',
      order: 4,
      parentKey: 'classroom',
      url: '/classroom/private/classes',
      label: {
        en: 'Classes admin',
        es: 'Clases admin',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.adminView,
        actionNames: ['view', 'admin'],
      },
    ],
  },
];

module.exports = {
  pluginName: 'plugins.classroom',
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
};
