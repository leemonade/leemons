const pluginName = 'plugins.timetable';

const permissionNames = {
  config: `${pluginName}.config`,
  timetable: `${pluginName}.timetable`,
};

const permissions = [
  {
    permissionName: permissionNames.config,
    actions: ['create', 'view', 'update', 'delete', 'admin'],
    localizationName: { en: 'Timetable - Config', es: 'Horario - Configuración' },
  },
  {
    permissionName: permissionNames.timetable,
    actions: ['create', 'view', 'update', 'delete', 'admin'],
    localizationName: { en: 'Timetable - Timetable', es: 'Horario - Horario' },
  },
];

const menuItems = [
  // Main
  {
    item: {
      key: 'timetable',
      // TODO: Move icons to the plugin's folder
      iconSvg: '/public/assets/svgs/timetable.svg',
      activeIconSvg: '/public/assets/svgs/timetableActive.svg',
      label: {
        en: 'Timetable',
        es: 'Horario',
      },
    },
  },
  // TODO: Add frontend routes
];

module.exports = {
  pluginName,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
};
