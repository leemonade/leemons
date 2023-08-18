const pluginName = 'families';

const permissionNames = {
  families: `${pluginName}.families`,
  config: `${pluginName}.config`,
  familiesBasicInfo: `${pluginName}.families-basic-info`,
  familiesCustomInfo: `${pluginName}.families-custom-info`,
  familiesGuardiansInfo: `${pluginName}.families-guardians-info`,
  familiesStudentsInfo: `${pluginName}.families-students-info`,
};

const permissions = [
  {
    permissionName: permissionNames.families,
    actions: ['view', 'create', 'update', 'delete', 'admin'],
    localizationName: { es: 'Familias', en: 'Families' },
  },
  {
    permissionName: permissionNames.config,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Familias - Configuración', en: 'Families - Setup' },
  },
  {
    permissionName: permissionNames.familiesBasicInfo,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Familias - Información basica', en: 'Families - Basic info' },
  },
  {
    permissionName: permissionNames.familiesCustomInfo,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Familias - Información custom', en: 'Families - Custom info' },
  },
  {
    permissionName: permissionNames.familiesGuardiansInfo,
    actions: ['view', 'update', 'admin'],
    localizationName: { es: 'Familias - Información tutores', en: 'Families - Guardians info' },
  },
  {
    permissionName: permissionNames.familiesStudentsInfo,
    actions: ['view', 'update', 'admin'],
    localizationName: {
      es: 'Familias - Información estudiantes',
      en: 'Families - Students info',
    },
  },
];
const datasetLocations = [
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
    pluginName: 'families',
  },
];

const menuItems = [
  {
    item: {
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
        permissionName: 'families.user-families',
        actionNames: ['view', 'admin'],
      },
    ],
    isCustomPermission: true,
  },
  {
    item: {
      key: 'families-data',
      parentKey: 'users.users',
      url: '/private/families/config',
      label: {
        en: 'Families setup',
        es: 'Configuración de las familias',
      },
    },
    permissions: [
      {
        permissionName: 'families.config',
        actionNames: ['view', 'admin'],
      },
    ],
  },
  {
    item: {
      key: 'families',
      parentKey: 'users.users',
      url: '/private/families/list',
      label: {
        en: 'Families list',
        es: 'Listado de familias',
      },
    },
    permissions: [
      {
        permissionName: 'families.families',
        actionNames: ['view', 'admin'],
      },
    ],
  },
];
const widgets = {
  items: [
    {
      zoneKey: 'users.user-detail',
      key: 'families.user-detail',
      url: 'user-detail/index',
    },
  ],
};

module.exports = {
  pluginName,
  permissions: {
    permissions,
    names: permissionNames,
  },
  datasetLocations,
  menuItems,
  widgets,
};
