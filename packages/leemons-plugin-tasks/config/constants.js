const permissionsPrefix = 'plugins.tasks';

const permissionNames = {
  tasks: `${permissionsPrefix}.tasks`,
  profiles: `${permissionsPrefix}.profiles`,
  library: `${permissionsPrefix}.library`,
};

const permissions = [
  {
    permissionName: permissionNames.tasks,
    actions: ['view', 'create', 'update', 'delete', 'admin'],
    localizationName: { es: 'Tareas', en: 'Tasks' },
  },
  {
    permissionName: permissionNames.profiles,
    actions: ['view', 'update', 'create', 'admin'],
    localizationName: {
      es: 'Tareas - Perfiles',
      en: 'Tasks - Profiles',
    },
  },
  {
    permissionName: permissionNames.library,
    actions: ['view', 'admin'],
    localizationName: {
      es: 'Tareas - Biblioteca',
      en: 'Tasks - Library',
    },
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
  profiles: {
    create: {
      permission: permissionNames.profiles,
      actions: ['create', 'admin'],
    },
    view: {
      permission: permissionNames.profiles,
      actions: ['view', 'admin'],
    },
    update: {
      permission: permissionNames.profiles,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.profiles,
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
};

const menuItems = [
  // Main
  {
    removed: true,
    item: {
      key: 'tasks',
      order: 303,
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
    removed: true,
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
        permissionName: permissionNames.profiles,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  {
    removed: true,
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
        permissionName: permissionNames.profiles,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // Library
  {
    removed: true,
    item: {
      key: 'library',
      order: 3,
      parentKey: 'tasks',
      url: '/private/tasks/library',
      label: {
        en: 'Library',
        es: 'Biblioteca',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.library,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  {
    removed: true,
    item: {
      key: 'new-task',
      order: 4,
      parentKey: 'tasks',
      url: '/private/tasks/library/create',
      label: {
        en: 'New task',
        es: 'Nueva tarea',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.library,
        actionNames: ['view', 'admin'],
      },
    ],
  },
];

const widgets = {
  zones: [{ key: `${permissionsPrefix}.class.students.tasks` }],
  items: [
    {
      zoneKey: 'plugins.dashboard.class.tabs',
      key: `${permissionsPrefix}.class.tab.students.tasks`,
      url: 'tab-student-tasks/index',
      properties: {
        label: `${permissionsPrefix}.tabStudentTasks.label`,
      },
    },
    {
      zoneKey: `${permissionsPrefix}.class.students.tasks`,
      key: `${permissionsPrefix}.class.students.tasks`,
      url: 'student-tasks/index',
    },
  ],
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
  widgets,
};
