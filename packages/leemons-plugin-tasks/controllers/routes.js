module.exports = [
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
    method: 'DELETE',
    path: '/tasks/:task/assignments/instance/:instance',
    handler: 'assignments.instanceDelete',
    authenticated: true,
  },
];
