const pluginName = 'plugins.curriculum';

const permissions = [
  {
    permissionName: `${pluginName}.curriculum-menu`,
    actions: ['view'],
    localizationName: { es: 'Curriculum Menu', en: 'Curriculum Menu' },
  },
  {
    permissionName: `${pluginName}.curriculum`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Curriculum', en: 'Curriculum' },
  },
];

const menuItems = [
  {
    config: {
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
    config: {
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
    config: {
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

module.exports = {
  pluginName,
  permissions,
  menuItems,
};
