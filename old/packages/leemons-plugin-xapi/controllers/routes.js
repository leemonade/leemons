module.exports = [
  /**
   * User agents
   * */
  {
    path: '/add/statement',
    method: 'POST',
    handler: 'xapi.addStatement',
    authenticated: true,
  },
];
