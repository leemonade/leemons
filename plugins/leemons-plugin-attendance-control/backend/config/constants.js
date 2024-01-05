const permissionsPrefix = 'attendance-control';

const permissionNames = {
  attendance: `${permissionsPrefix}.attendance`,
};

const permissions = [
  {
    permissionName: permissionNames.attendance,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Asistencia',
      en: 'Attendance',
    },
  },
];

const menuItems = [
  {
    item: {
      key: 'attendance-control.attendance',
      order: 3,
      parentKey: 'scores.scores',
      url: '/private/attendance-control/attendance',
      label: {
        en: 'Attendance',
        es: 'Asistencia',
      },
    },
    permissions: [{ permissionName: permissionNames.attendance, actionNames: ['view', 'admin'] }],
  },
];

const widgets = {
  zones: [],
  items: [
    {
      zoneKey: 'academic-portfolio.class.students',
      key: `attendance-control.class.header-bar`,
      url: 'class-header-bar/index',
    },
    {
      zoneKey: 'dashboard.class.tabs',
      key: `attendance-control.class.tabs.detail`,
      url: 'class-tab-detail/index',
      profiles: ['teacher'],
    },
  ],
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
  widgets,
};
