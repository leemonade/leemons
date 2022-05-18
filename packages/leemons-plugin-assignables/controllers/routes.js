module.exports = [
  /**
   * Assignable Instances
   */
  {
    method: 'GET',
    path: '/assignableInstances',
    handler: 'assignableInstance.search',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/assignableInstances/:id',
    handler: 'assignableInstance.get',
    authenticated: true,
  },
  /**
   * Assignations
   */
  {
    method: 'GET',
    path: '/assignableInstances/:instance/assignations/:user',
    handler: 'assignations.get',
    authenticated: true,
  },
];
