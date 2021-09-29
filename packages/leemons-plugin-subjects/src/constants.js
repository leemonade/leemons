module.exports = {
  permissions: {
    knowledge: {
      create: {
        permission: 'plugins.subjects.tree',
        actions: ['create', 'admin'],
      },
      view: {
        permission: 'plugins.subjects.tree',
        actions: ['view', 'admin'],
      },
      update: {
        permission: 'plugins.subjects.tree',
        actions: ['update', 'admin'],
      },
      delete: {
        permission: 'plugins.subjects.tree',
        actions: ['delete', 'admin'],
      },
      assignables: [
        {
          permission: 'plugins.subjects.tree',
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
