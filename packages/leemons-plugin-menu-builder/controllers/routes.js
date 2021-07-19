module.exports = [
  /**
   * Menu
   * */
  {
    path: '/menu/:key',
    method: 'GET',
    handler: 'menu.getMenu',
    authenticated: true,
  },
];
