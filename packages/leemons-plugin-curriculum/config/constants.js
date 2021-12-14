const pluginName = 'plugins.curriculum';

const permissions = [
  {
    permissionName: `${pluginName}.curriculum`,
    actions: ['update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Curriculum', en: 'Curriculum' },
  },
];

module.exports = {
  pluginName,
  permissions,
};
