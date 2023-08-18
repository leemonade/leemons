const permissionsPrefix = 'assignables';

const permissionsNames = {
  activities: `${permissionsPrefix}.activities`,
};

const permissions = [
  {
    permissionsName: permissionsNames.activities,
    actions: ['view'],
    localizationName: { es: 'Actividades', en: 'Activities' },
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
      zoneKey: 'plugins.dashboard.class.tabs',
      key: `${permissionsPrefix}.class.tab.ongoing`,
      url: 'dashboard/tab-ongoing/index',
      properties: {
        label: `${permissionsPrefix}.ongoing.activities`,
      },
    },
    // --- NYA (Subject Dashboard Ongoing) ---
    {
      // zoneKey: 'plugins.dashboard.class.control-panel',
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
      zoneKey: 'plugins.dashboard.program.left',
      key: `${permissionsPrefix}.dashboard.need-your-attention`,
      url: 'dashboard/nya/index',
    },
  ],
};

module.exports = {
  permissions,
  menuItems,
  widgets,
};
