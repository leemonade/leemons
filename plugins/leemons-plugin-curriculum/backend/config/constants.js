const pluginName = 'curriculum';

const permissionNames = {
  curriculumMenu: `${pluginName}.curriculum-menu`,
  curriculum: `${pluginName}.curriculum`,
};

const permissions = [
  {
    permissionName: permissionNames.curriculumMenu,
    actions: ['view'],
    localizationName: { es: 'Curriculum Menu', en: 'Curriculum Menu' },
  },
  {
    permissionName: permissionNames.curriculum,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Curriculum', en: 'Curriculum' },
  },
];

// TODO @askJaime: se ha cambiado el 'config' a 'item' en todos los menuItems para que se ajusten a la función genérica. No se ha encontrado alguna otra llamada, está bien?
const menuItems = [
  {
    item: {
      key: 'curriculum',
      order: 300,
      iconSvg: '/public/curriculum/curriculum.svg',
      activeIconSvg: '/public/curriculum/curriculum-active.svg',
      label: {
        en: 'Curriculum',
        es: 'Curriculum',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.curriculum-menu`,
        actionNames: ['view'],
      },
    ],
  },
  {
    item: {
      key: 'curriculum-new',
      parentKey: `${pluginName}.curriculum`,
      url: '/private/curriculum/new',
      label: {
        en: 'New curriculum',
        es: 'Nuevo curriculum',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.curriculum`,
        actionNames: ['create', 'update', 'admin'],
      },
    ],
  },
  {
    item: {
      key: 'curriculum-library',
      parentKey: `${pluginName}.curriculum`,
      url: '/private/curriculum/list',
      label: {
        en: 'Library',
        es: 'Biblioteca',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.curriculum-menu`,
        actionNames: ['view'],
      },
    ],
  },
];

// TODO @askJaime: Se ha migrado este constants file, no he encontrado que se llame en otro lugar. Está bien?
// module.exports = {
//   pluginName,
//   permissions,
//   menuItems,
// };

module.exports = {
  pluginName,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
};
