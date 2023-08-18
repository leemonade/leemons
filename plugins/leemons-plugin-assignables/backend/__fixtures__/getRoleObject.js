function getRoleObject() {
  const category = {
    creatable: true,
    createUrl: '/createUrl',
    order: 2,

    componentOwner: 'plugins.testing',
    listCardComponent: 'ListCard',
    detailComponent: 'Detail',

    menu: {
      item: {
        iconSvg: '/public/icon.svg',
        activeIconSvg: '/public/active-icon.svg',
        label: {
          en: 'Testing',
          es: 'Testing',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.testing.role',
          actionNames: ['view'],
        },
      ],
    },
  };

  const role = {
    name: 'testing-role',

    teacherDetailUrl: '/teacherDetailUrl',
    studentDetailUrl: '/studentDetailUrl',
    evaluationDetailUrl: '/evaluationDetailUrl',
    dashboardUrl: '/dashboardUrl',
    previewUrl: '/previewUrl',

    pluralName: { en: 'testing-roles', es: 'roles-testing' },
    singularName: { en: 'testing-role', es: 'rol-testing' },

    ...category,
  };

  return { role, category };
}

module.exports = {
  getRoleObject,
};
