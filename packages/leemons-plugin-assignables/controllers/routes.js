module.exports = [
  {
    method: 'GET',
    path: '/test',
    handler: 'test.test',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/createUser',
    handler: 'test.createUser',
  },
  {
    method: 'GET',
    path: '/instances',
    handler: 'assignables.listInstances',
    authenticated: true,
  },
];
