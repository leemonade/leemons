module.exports = {
  permissions: [
    {
      permissionName: 'plugins.families-emergency-numbers.families-emergency-numbers',
      actions: ['view', 'update'],
      localizationName: {
        es: 'Familias - Números de emergencia',
        en: 'Families - Emergency numbers',
      },
    },
  ],
  datasetLocations: [
    {
      name: {
        es: 'Datos familias - Numeros de emergencia',
        en: 'Families data - Emergency numbers',
      },
      description: {
        es:
          'Añade datos adicionales comunes a todos los numeros de telefono de emergencia de las familias',
        en: 'Adds additional data common to all family emergency phone numbers',
      },
      locationName: 'families-emergency-numbers-data',
      pluginName: 'plugins.families-emergency-numbers',
    },
  ],
};
