module.exports = {
  pluginName: 'plugins.classroom',
  defaultPermissions: [
    {
      permissionName: 'plugins.classroom.classroom',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Clases', en: 'Classroom' },
    },
  ],
  menuItems: {
    main: {
      item: {
        key: 'classroom',
        iconSvg: '/classroom/classroom.svg',
        activeIconSvg: '/classroom/classroomActive.svg',
        label: {
          en: 'Classroom',
          es: 'Clases',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.classroom.classroom',
          actionNames: ['view'],
        },
      ],
    },
    tree: {
      item: {
        key: 'tree',
        order: 2,
        parentKey: 'classroom',
        url: '/classroom/private/tree',
        label: {
          en: 'Tree',
          es: 'Árbol',
        },
        disabled: true,
      },
      permissions: [
        {
          permissionName: 'plugins.classroom.classroom',
          actionNames: ['view'],
        },
      ],
    },
    welcome: {
      item: {
        key: 'welcome',
        order: 1,
        parentKey: 'classroom',
        url: '/classroom/private/welcome',
        label: {
          en: 'Welcome',
          es: 'Bienvenida',
        },
      },
      permissions: [
        {
          permissionName: 'plugins.classroom.classroom',
          actionNames: ['view'],
        },
      ],
    },
    organization: {
      item: {
        key: 'organization',
        order: 3,
        parentKey: 'classroom',
        url: '/classroom/private/organization',
        label: {
          en: 'Organization',
          es: 'Organización',
        },
        disabled: true,
      },
      permissions: [
        {
          permissionName: 'plugins.classroom.classroom',
          actionNames: ['view'],
        },
      ],
    },
    classes: {
      item: {
        key: 'classes',
        order: 4,
        parentKey: 'classroom',
        url: '/classroom/private/classes',
        label: {
          en: 'Classes admin',
          es: 'Clases admin',
        },
        disabled: true,
      },
      permissions: [
        {
          permissionName: 'plugins.classroom.classroom',
          actionNames: ['view'],
        },
      ],
    },
  },
};
