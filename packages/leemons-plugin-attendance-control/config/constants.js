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
  // Main
  {
    item: {
      key: 'attendance-control.attendance',
      order: 3,
      parentKey: 'scores',
      url: '/private/attendance-control/attendance',
      label: {
        en: 'Attendance',
        es: 'Asistencia',
      },
    },
    permissions: [{ permissionName: permissionNames.attendance, actionNames: ['view', 'admin'] }],
  },
];

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
};
