module.exports = {
  pluginName: 'dataset',
  defaultPermissions: [
    {
      permissionName: 'dataset.dataset',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Datasets', en: 'Datasets' },
    },
  ],
};
