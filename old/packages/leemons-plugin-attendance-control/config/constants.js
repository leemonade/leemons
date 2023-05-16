const permissionsPrefix = 'plugins.attendance-control';

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
      parentKey: 'plugins.scores.scores',
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
      zoneKey: 'plugins.academic-portfolio.class.students',
      key: `plugins.attendance-control.class.header-bar`,
      url: 'class-header-bar/index',
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
