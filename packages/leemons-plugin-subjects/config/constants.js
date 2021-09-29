const permissionsPrefix = 'plugins.subjects';

const permissionNames = {
  tree: `${permissionsPrefix}.tree`,
  knowledge: `${permissionsPrefix}.knowledge`,
  adminView: `${permissionsPrefix}.adminview`,
  subject: `${permissionsPrefix}.subject`,
};

const permissions = [
  {
    permissionName: permissionNames.tree,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Asignaturas - Árbol', en: 'Subjects - Tree' },
  },
  {
    permissionName: permissionNames.knowledge,
    actions: ['view', 'update', 'create', 'assign', 'delete', 'admin'],
    localizationName: { es: 'Asignaturas - Área de conocimiento', en: 'Subjects - Knowledge area' },
  },
  {
    permissionName: permissionNames.adminView,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Asignaturas - Admin', en: 'Subjects - Admin' },
  },
  {
    permissionName: permissionNames.subject,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Asignaturas', en: 'Subjects' },
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
  knowledge: {
    create: {
      permission: permissionNames.knowledge,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.knowledge,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.knowledge,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.knowledge,
      actions: ['delete', 'admin'],
    },
    assignUsers: [
      {
        permission: permissionNames.knowledge,
        actions: ['view', 'admin'],
      },
      {
        permission: permissionNames.knowledge,
        actions: ['assign', 'admin'],
      },
      {
        permission: 'plugins.users.users',
        actions: ['view', 'admin'],
      },
    ],
    viewUsers: [
      {
        permission: permissionNames.knowledge,
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
      key: 'subject',
      iconSvg: '/subjects/subjects.svg',
      activeIconSvg: '/subjects/subjectsActive.svg',
      label: {
        en: 'Subjects',
        es: 'Asignaturas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.subject,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'welcome',
      order: 1,
      parentKey: 'subject',
      url: '/subjects/private/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.subject,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Tree
  {
    item: {
      key: 'tree',
      order: 2,
      parentKey: 'subject',
      url: '/subjects/private/tree',
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
  // Knowledge
  {
    item: {
      key: 'knowledge',
      order: 3,
      parentKey: 'subject',
      url: '/subjects/private/knowledge',
      label: {
        en: 'Knowledge Area',
        es: 'Área de Conocimiento',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.knowledge,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Subjects
  {
    item: {
      key: 'subjects',
      order: 4,
      parentKey: 'subject',
      url: '/subjects/private/subjects',
      label: {
        en: 'Subjects admin',
        es: 'Asignaturas admin',
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
  pluginName: 'plugins.subjects',
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
};
