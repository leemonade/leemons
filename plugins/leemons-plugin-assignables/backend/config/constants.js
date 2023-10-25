const permissionsPrefix = 'assignables';

const permissionsNames = {
  activities: `${permissionsPrefix}.activities`,
  ongoing: `${permissionsPrefix}.ongoing`,
  history: `${permissionsPrefix}.history`,
};

const permissions = [
  {
    permissionName: permissionsNames.activities,
    actions: ['view'],
    localizationName: { es: 'Actividades', en: 'Activities' },
  },
  {
    permissionName: permissionsNames.ongoing,
    actions: ['view'],
    localizationName: {
      es: 'Actividades - En curso',
      en: 'Activities - Ongoing',
    },
  },
  {
    permissionName: permissionsNames.history,
    actions: ['view'],
    localizationName: {
      es: 'Actividades - Histórico',
      en: 'Activities - History',
    },
  },
];

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
        permissionName: permissionsNames.activities,
        actionNames: ['view'],
      },
    ],
  },
];

const widgets = {
  zones: [
    {
      key: `${permissionsPrefix}.class.ongoing`,
      name: 'Ongoing activities',
      description: 'Zone for ongoing activities',
    },
  ],
  items: [
    // --- Class (Ongoing tab) ---
    {
      zoneKey: 'dashboard.class.tabs',
      key: `${permissionsPrefix}.class.tab.ongoing`,
      url: 'dashboard/tab-ongoing/index',
      properties: {
        label: `${permissionsPrefix}.ongoing.activities`,
      },
    },
    // --- NYA (Subject Dashboard Ongoing) ---
    {
      // zoneKey: 'dashboard.class.control-panel',
      zoneKey: `${permissionsPrefix}.class.ongoing`,
      key: `${permissionsPrefix}.dashboard.subject.need-your-attention`,
      url: 'dashboard/nya/index',
    },
    // --- Class (Ongoing) ---
    {
      zoneKey: `${permissionsPrefix}.class.ongoing`,
      key: `${permissionsPrefix}.class.ongoing`,
      url: 'dashboard/ongoing/index',
    },
    // --- NYA (Main Dashboard) ---
    {
      zoneKey: 'dashboard.program.left',
      key: `${permissionsPrefix}.dashboard.need-your-attention`,
      url: 'dashboard/nya/index',
    },
  ],
};

// Assignables specific permissions
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

module.exports = {
  permissions,
  menuItems,
  widgets,

  assignableRoles,
  assignableActions,
  assignableRolesObject,

  assignableInstanceRoles,
  assignableInstanceActions,
  assignableInstanceRolesObject,
};
