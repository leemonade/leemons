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
    localizationName: { es: 'Actividades', en: 'Activities' },
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
      order: 202,
      iconSvg: '/public/assignables/menu-icon.svg',
      activeIconSvg: '/public/assignables/menu-icon.svg',
      url: '/private/assignables/ongoing',
      label: {
        en: 'Ongoing Activities',
        es: 'Actividades en curso',
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
    removed: true,
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
];

const widgets = {
  zones: [
    {
      key: `${pluginName}.class.ongoing`,
      name: 'Ongoing activities',
      description: 'Zone for ongoing activities',
    },
  ],
  items: [
    // --- Class (Ongoing tab) ---
    {
      zoneKey: 'plugins.dashboard.class.tabs',
      key: `${pluginName}.class.tab.ongoing`,
      url: 'dashboard/tab-ongoing/index',
      properties: {
        label: `${pluginName}.ongoing.activities`,
      },
    },
    // --- NYA (Subject Dashboard Ongoing) ---
    {
      // zoneKey: 'plugins.dashboard.class.control-panel',
      zoneKey: `${pluginName}.class.ongoing`,
      key: `${pluginName}.dashboard.subject.need-your-attention`,
      url: 'dashboard/nya/index',
    },
    // --- Class (Ongoing) ---
    {
      zoneKey: `${pluginName}.class.ongoing`,
      key: `${pluginName}.class.ongoing`,
      url: 'dashboard/ongoing/index',
    },
    // --- NYA (Main Dashboard) ---
    {
      zoneKey: 'plugins.dashboard.program.left',
      key: `${pluginName}.dashboard.need-your-attention`,
      url: 'dashboard/nya/index',
    },
  ],
};

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

  widgets,
};
