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
];
