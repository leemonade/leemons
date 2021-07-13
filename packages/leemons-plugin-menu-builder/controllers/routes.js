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
  {
    path: '/menu/:key/add-item',
    method: 'POST',
    handler: 'menu.addMenuItem',
    authenticated: true,
  },
  {
    path: '/menu/:key/re-order',
    method: 'POST',
    handler: 'menu.reOrder',
    authenticated: true,
  },
];
