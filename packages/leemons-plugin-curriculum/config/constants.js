const pluginName = 'plugins.curriculum';

const permissions = [
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
      order: 9,
      iconSvg: '/public/assets/svgs/curriculum.svg',
      activeIconSvg: '/public/assets/svgs/curriculum.svg',
      label: {
        en: 'Curriculum',
        es: 'Curriculum',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.curriculum`,
        actionNames: ['admin'],
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
        es: 'Libreria',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.curriculum`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
];

module.exports = {
  pluginName,
  permissions,
  menuItems,
};
