module.exports = {
  pluginName: 'providers.leebrary-tasks',
  category: {
    key: 'tasks',
    creatable: true,
    createUrl: '/private/tasks/create',
    duplicable: true,
    provider: 'leebrary-tasks',
    canUse: ['plugins.tasks', 'plugins.assignables'],
    menu: {
      item: {
        iconSvg: '/public/leebrary-tasks/menu-icon.svg',
        activeIconSvg: '/public/leebrary-tasks/menu-icon.svg',
        label: {
          en: 'Tasks',
          es: 'Tareas',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.leebrary.library',
          actionNames: ['view', 'update', 'create', 'delete', 'admin'],
        },
      ],
    },
    listCardComponent: 'ListCard',
    detailComponent: 'Detail',
  },
};
