const pluginName = 'plugins.assignables';
const assignableActions = ['edit', 'view', 'view+student', 'assign', 'delete'];
const assignableRoles = ['viewer', 'student', 'editor', 'owner'];
const assignableRolesObject = {
  owner: {
    actions: assignableActions,
    canAssign: assignableRoles,
  },
  editor: {
    actions: ['edit', 'view', 'assign'],
    canAssign: ['viewer', 'student'],
  },
  viewer: {
    actions: ['view'],
    canAssign: [],
  },
  student: {
    actions: ['view', 'view+student'],
    canAssign: [],
  },
};

const assignableInstanceActions = ['view', 'edit'];
const assignableInstanceRoles = ['student', 'teacher'];
const assignableInstanceRolesObject = {
  student: {
    actions: ['view'],
    canAssign: [],
  },
  teacher: {
    actions: ['view', 'edit'],
    canAssign: ['student'],
  },
};

const permissionNames = {
  activities: `${pluginName}.activities`,
  ongoing: `${pluginName}.ongoing`,
  history: `${pluginName}.history`,
};

const permissions = [
  {
    permissionName: permissionNames.activities,
    actions: ['view'],
    localizationName: { es: 'Actividaded', en: 'Activities' },
  },
  {
    permissionName: permissionNames.ongoing,
    actions: ['view'],
    localizationName: {
      es: 'Actividades - En curso',
      en: 'Activities - Ongoing',
    },
  },
  {
    permissionName: permissionNames.history,
    actions: ['view'],
    localizationName: {
      es: 'Actividades - Histórico',
      en: 'Activities - History',
    },
  },
];

/**
 * MENU BUILDER
 */
const menuItems = [
  {
    item: {
      key: 'activities',
      order: 11,
      iconSvg: '/public/tasks/tasks-menu-icon.svg',
      activeIconSvg: '/public/tasks/tasks-menu-icon.svg',
      label: {
        en: 'Activities',
        es: 'Actividades',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.activities,
        actionNames: ['view'],
      },
    ],
  },
  {
    item: {
      key: 'activities.ongoing',
      order: 1,
      parentKey: 'activities',
      url: '/private/assignables/ongoing',
      label: {
        en: 'Ongoing',
        es: 'En curso',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.ongoing,
        actionNames: ['view'],
      },
    ],
  },
  {
    item: {
      key: 'activities.history',
      order: 2,
      parentKey: 'activities',
      url: '/private/assignables/history',
      label: {
        en: 'History',
        es: 'Histórico',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.history,
        actionNames: ['view'],
      },
    ],
  },
];

module.exports = {
  pluginName,

  assignableRoles,
  assignableActions,
  assignableRolesObject,

  assignableInstanceRoles,
  assignableInstanceActions,
  assignableInstanceRolesObject,

  menuItems,
  permissions,
};
