module.exports = {
  permissions: [
    {
      permissionName: 'plugins.families.families',
      actions: ['view', 'create', 'update', 'delete', 'admin'],
      localizationName: { es: 'Familias', en: 'Families' },
    },
    {
      permissionName: 'plugins.families.config',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Familias - Configuración', en: 'Families - Setup' },
    },
    {
      permissionName: 'plugins.families.families-basic-info',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Familias - Información basica', en: 'Families - Basic info' },
    },
    {
      permissionName: 'plugins.families.families-custom-info',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Familias - Información custom', en: 'Families - Custom info' },
    },
    {
      permissionName: 'plugins.families.families-guardians-info',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Familias - Información tutores', en: 'Families - Guardians info' },
    },
    {
      permissionName: 'plugins.families.families-students-info',
      actions: ['view', 'update', 'admin'],
      localizationName: {
        es: 'Familias - Información estudiantes',
        en: 'Families - Students info',
      },
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
        key: 'user-families',
        iconSvg: '/public/assets/svgs/family.svg',
        activeIconSvg: '/public/assets/svgs/family.svg',
        label: {
          en: 'Families',
          es: 'Familias',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.families.user-families',
          actionNames: ['view', 'admin'],
        },
      ],
      isCustomPermission: true,
    },
    {
      config: {
        key: 'families-data',
        parentKey: 'plugins.users.users',
        url: '/private/families/config',
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
        url: '/private/families/list',
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
  widgets: {
    items: [
      {
        zoneKey: 'plugins.users.user-detail',
        key: 'plugins.families.user-detail',
        url: 'user-detail/index',
      },
    ],
  },
};
