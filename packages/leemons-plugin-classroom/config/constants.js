module.exports = {
  pluginName: 'plugins.classroom',
  permissions: [
    {
      permissionName: 'plugins.classroom.tree',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Clases - Árbol', en: 'Classroom - Tree' },
    },
    {
      permissionName: 'plugins.classroom.organization',
      actions: ['view', 'update', 'create', 'assign', 'delete', 'admin'],
      localizationName: { es: 'Clases - Organización', en: 'Classroom - Organization' },
    },
    {
      permissionName: 'plugins.classroom.adminview',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Clases - Admin', en: 'Classroom - Admin' },
    },
    {
      permissionName: 'plugins.classroom.classroom',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Clases', en: 'Classroom' },
    },
  ],
  permissionNames: {
    tree: 'plugins.classroom.tree',
    organization: 'plugins.classroom.organization',
    adminView: 'plugins.classroom.adminview',
    classroom: 'plugins.classroom.classroom',
  },
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
          actionNames: ['view', 'admin'],
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
          actionNames: ['view', 'admin'],
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
          actionNames: ['view', 'admin'],
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
          actionNames: ['view', 'admin'],
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
          actionNames: ['view', 'admin'],
        },
      ],
    },
  },
};
