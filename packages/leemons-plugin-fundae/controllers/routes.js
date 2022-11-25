module.exports = [
  /**
   * User agents
   * */
  {
    path: '/report/add',
    method: 'POST',
    handler: 'report.generate',
    authenticated: true,
  },
];
