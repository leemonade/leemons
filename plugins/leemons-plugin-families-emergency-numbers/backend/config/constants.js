const pluginName = 'families-emergency-numbers';

const permissionNames = {
  familiesEmergencyNumbers: `${pluginName}.families-emergency-numbers`,
};

const permissions = [
  {
    permissionName: permissionNames.familiesEmergencyNumbers,
    actions: ['view', 'update'],
    localizationName: {
      es: 'Familias - Números de emergencia',
      en: 'Families - Emergency numbers',
    },
  },
];
const datasetLocations = [
  {
    name: {
      es: 'Datos familias - Numeros de emergencia',
      en: 'Families data - Emergency numbers',
    },
    description: {
      es: 'Añade datos adicionales comunes a todos los numeros de telefono de emergencia de las familias',
      en: 'Adds additional data common to all family emergency phone numbers',
    },
    locationName: 'families-emergency-numbers-data',
    pluginName: 'families-emergency-numbers',
  },
];

module.exports = {
  pluginName,
  permissions: {
    permissions,
    names: permissionNames,
  },
  datasetLocations,
};
