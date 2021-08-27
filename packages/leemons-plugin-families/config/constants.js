module.exports = {
  permissions: [
    {
      permissionName: 'plugins.families.config',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Configuración de las familias', en: 'Families setup' },
    },
  ],
  datasetLocations: [
    {
      name: {
        es: 'Datos familias',
        en: 'Families data',
      },
      description: {
        es: 'Añade datos adicionales comunes a todas las familias',
        en: 'Adds additional data common to all families',
      },
      locationName: 'families-data',
      pluginName: 'plugins.families',
    },
  ],
};
