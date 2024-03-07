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
  zones: [{ key: `${permissionsPrefix}.class` }],
  items: [
    {
      zoneKey: 'academic-portfolio.class.students',
      key: `${permissionsPrefix}.class.header-bar`,
      url: 'class-header-bar/index',
    },
    {
      zoneKey: 'dashboard.class.tabs',
      key: `${permissionsPrefix}.class.tabs.detail`,
      url: 'class-tab-detail/index',
      profiles: ['teacher'],
      properties: {
        label: `${permissionsPrefix}.tabKanban.label`,
      },
    },
    {
      zoneKey: `${permissionsPrefix}.class`,
      key: `${permissionsPrefix}.class.tabs.detail-table`,
      url: 'class-tab-detail-table/index',
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
