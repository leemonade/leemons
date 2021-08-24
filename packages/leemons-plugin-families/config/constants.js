module.exports = {
  permissions: [
    {
      permissionName: 'plugins.families.config',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Configuración de las familias', en: 'Families setup' },
    },
    {
      permissionName: 'plugins.families.families',
      actions: ['view', 'create', 'update', 'delete', 'admin'],
      localizationName: { es: 'Familias', en: 'Families' },
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
  menuItems: [
    {
      config: {
        key: 'families-data',
        parentKey: 'plugins.users.users',
        url: '/families/private/config',
        label: {
          en: 'Families setup',
          es: 'Configuración de las familias',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.families.config',
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      config: {
        key: 'families',
        parentKey: 'plugins.users.users',
        url: '/families/private/list',
        label: {
          en: 'Families list',
          es: 'Listado de familias',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.families.families',
          actionNames: ['view', 'admin'],
        },
      ],
    },
  ],
};
