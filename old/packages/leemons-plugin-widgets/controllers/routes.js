module.exports = [
  /**
   * Widgets
   * */
  {
    path: '/zone/:key',
    method: 'GET',
    handler: 'widgets.getZone',
    authenticated: true,
  },
];
