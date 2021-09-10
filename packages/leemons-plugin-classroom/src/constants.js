module.exports = {
  permissions: {
    organization: {
      create: {
        permission: 'plugins.classroom.tree',
        actions: ['create', 'admin'],
      },
      view: {
        permission: 'plugins.classroom.tree',
        actions: ['view', 'admin'],
      },
      update: {
        permission: 'plugins.classroom.tree',
        actions: ['update', 'admin'],
      },
      delete: {
        permission: 'plugins.classroom.tree',
        actions: ['delete', 'admin'],
      },
      assignables: [
        {
          permission: 'plugins.classroom.tree',
          actions: ['update', 'admin'],
        },
        {
          permission: 'plugins.users.profiles',
          actions: ['view', 'admin'],
        },
      ],
    },
    profiles: {
      view: {
        permission: 'plugins.users.profile',
        actions: ['view', 'admin'],
      },
    },
  },
};
