module.exports = [
  {
    method: 'GET',
    path: '/test',
    handler: 'test.test',
    authenticated: true,
  },
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
];
