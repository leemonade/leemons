module.exports = {
  pluginName: 'plugins.dataset',
  defaultPermissions: [
    {
      permissionName: 'plugins.dataset.dataset',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Datasets', en: 'Datasets' },
    },
  ],
};
