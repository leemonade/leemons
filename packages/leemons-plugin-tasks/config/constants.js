const permissionsPrefix = 'plugins.tasks';

const permissionNames = {
  tasks: `${permissionsPrefix}.tasks`,
  library: `${permissionsPrefix}.library`,
  ongoing: `${permissionsPrefix}.ongoing`,
  history: `${permissionsPrefix}.history`,
};

const permissions = [
  {
    permissionName: permissionNames.tasks,
    actions: ['view', 'create', 'update', 'delete', 'admin'],
    localizationName: { es: 'Tareas', en: 'Tasks' },
  },
  {
    permissionName: permissionNames.library,
    actions: ['view', 'admin'],
    localizationName: {
      es: 'Tareas - Librería',
      en: 'Tasks - Library',
    },
  },
  {
    permissionName: permissionNames.ongoing,
    actions: ['view', 'admin'],
    localizationName: {
      es: 'Tareas - En curso',
      en: 'Tasks - Ongoing',
    },
  },
  {
    permissionName: permissionNames.history,
    actions: ['view', 'admin'],
    localizationName: { es: 'Tareas - Historial', en: 'Tasks - History' },
  },
];

const permissionsBundles = {
  tasks: {
    create: {
      permission: permissionNames.tasks,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.tasks,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tasks,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.tasks,
      actions: ['delete', 'admin'],
    },
  },
  library: {
    create: {
      permission: permissionNames.tasks,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.library,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tasks,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.tasks,
      actions: ['delete', 'admin'],
    },
  },
  ongoing: {
    view: {
      permission: permissionNames.ongoing,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tasks,
      actions: ['update', 'admin'],
    },
  },
  history: {
    view: {
      permission: permissionNames.history,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.tasks,
      actions: ['update', 'admin'],
    },
  },
};

const menuItems = [
  // Main
  {
    item: {
      key: 'tasks',
      iconSvg: '/public/tasks/tasks-menu-icon.svg',
      activeIconSvg: '/public/tasks/tasks-menu-icon.svg',
      label: {
        en: 'Tasks',
        es: 'Tareas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tasks,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Welcome
  {
    item: {
      key: 'welcome',
      order: 1,
      parentKey: 'tasks',
      url: '/private/tasks/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tasks,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  {
    item: {
      key: 'profiles',
      order: 2,
      parentKey: 'tasks',
      url: '/private/tasks/profiles',
      label: {
        en: 'Profiles',
        es: 'Perfiles',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.tasks,
        actionNames: ['admin'],
      },
    ],
  },
  // Library
  {
    item: {
      key: 'library',
      order: 3,
      parentKey: 'tasks',
      url: '/private/tasks/library',
      label: {
        en: 'Library',
        es: 'Librería',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.library,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Ongoing
  {
    item: {
      key: 'ongoing',
      order: 4,
      parentKey: 'tasks',
      url: '/private/tasks/ongoing',
      label: {
        en: 'Ongoing',
        es: 'En curso',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.ongoing,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // History
  {
    item: {
      key: 'history',
      order: 5,
      parentKey: 'tasks',
      url: '/private/tasks/history',
      label: {
        en: 'History',
        es: 'Historial',
      },
      disabled: true,
    },
    permissions: [
      {
        permissionName: permissionNames.history,
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
    bundles: permissionsBundles,
  },
  menuItems,
};
