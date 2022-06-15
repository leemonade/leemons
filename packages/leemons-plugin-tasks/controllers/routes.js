const {
  permissions: { names: permissions },
} = require('../config/constants');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

module.exports = [
  // ························································
  // Tags
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: {
      'plugins.tasks.library': {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),
  /**
   * Profiles
   */
  {
    method: 'GET',
    path: '/profiles/:key',
    handler: 'profiles.get',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/profiles/:key',
    handler: 'profiles.set',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/profiles',
    handler: 'profiles.setMany',
    authenticated: true,
  },
  /**
   * Tasks
   */
  {
    method: 'POST',
    path: '/tasks',
    handler: 'tasks.create',
    authenticated: true,
  },
  {
    method: 'PUT',
    path: '/tasks/:id',
    handler: 'tasks.update',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/tasks/:id/duplicate',
    handler: 'tasks.duplicate',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/search',
    handler: 'tasks.search',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/:id',
    handler: 'tasks.get',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
    handler: 'tasks.remove',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/tasks/:id/publish',
    handler: 'tasks.publish',
    authenticated: true,
  },

  /**
   * Tags
   */
  /*
  {
    method: 'POST',
    path: '/tasks/:task/tags',
    handler: 'tags.add',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/:task/tags',
    handler: 'tags.get',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/:task/tags',
    handler: 'tags.remove',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/:task/tags/has',
    handler: 'tags.has',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/tags/list',
    handler: 'tags.list',
    authenticated: true,
  },
  */
  /**
   * Attachments
   */
  {
    method: 'POST',
    path: '/tasks/:task/attachments',
    handler: 'attachments.add',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/:task/attachments',
    handler: 'attachments.get',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/:task/attachments',
    handler: 'attachments.remove',
    authenticated: true,
  },

  /**
   *  Assignments
   */

  // Instance
  {
    method: 'POST',
    path: '/tasks/:task/assignments/instance',
    handler: 'assignments.instanceCreate',
    authenticated: true,
  },
  {
    method: 'PUT',
    path: '/tasks/assignments/instance/:instance',
    handler: 'assignments.instanceUpdate',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/:task/assignments/instance/:instance',
    handler: 'assignments.instanceDelete',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/search',
    handler: 'assignments.search',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/:instance',
    handler: 'assignments.instanceGet',
    authenticated: true,
  },
  // Student
  {
    method: 'POST',
    path: '/tasks/instances/:instance/student',
    handler: 'assignments.studentAssign',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/instances/:instance/student/:student',
    handler: 'assignments.studentUnassign',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/student/:user',
    handler: 'assignments.studentListAssigned',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/:instance/students',
    handler: 'assignments.studentList',
    authenticated: true,
  },
  {
    method: 'PUT',
    path: '/tasks/instances/:instance/students/:student',
    handler: 'assignments.studentUpdate',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/tasks/instances/:instance/students/:student/calification',
    handler: 'assignments.studentCalificate',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/:instance/students/:student/calification',
    handler: 'assignments.studentGetCalification',
    authenticated: true,
  },
  // Teacher
  {
    method: 'POST',
    path: '/tasks/instances/:instance/teacher',
    handler: 'assignments.teacherAssign',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/tasks/instances/:instance/teacher/:teacher',
    handler: 'assignments.teacherUnassign',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/:instance/teachers',
    handler: 'assignments.teacherList',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/teacher/:user',
    handler: 'assignments.teacherListAssigned',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/teacher/:user/search',
    handler: 'assignments.teacherSearch',
    authenticated: true,
  },

  // Group
  {
    method: 'POST',
    path: '/tasks/instances/:instance/group',
    handler: 'assignments.groupAssign',
    authenticated: true,
  },

  // Deliverables
  {
    method: 'POST',
    path: '/tasks/instances/:instance/:user/deliverables/:type',
    handler: 'assignments.setDeliverable',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/tasks/instances/:instance/:user/deliverables/:type',
    handler: 'assignments.getDeliverable',
    authenticated: true,
  },

  /**
   * Settings
   */
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tasks, ['view']),
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tasks, ['update']),
  },
  {
    path: '/settings/enable-menu-item',
    method: 'POST',
    handler: 'settings.enableMenuItem',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tasks, ['update']),
  },
];
