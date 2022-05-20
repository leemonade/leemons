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

/**
 * MENU BUILDER
 */
const menuItems = [
  {
    item: {
      key: 'activities',
      order: 25,
      iconSvg: '/public/tasks/tasks-menu-icon.svg',
      activeIconSvg: '/public/tasks/tasks-menu-icon.svg',
      label: {
        en: 'Activities',
        es: 'Actividades',
      },
    },
    permissions: [
      // TODO: Add permissions to students
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
      // TODO: Add permissions to students
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
      // TODO: Add permissions to students
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
};
