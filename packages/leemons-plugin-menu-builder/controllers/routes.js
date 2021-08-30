module.exports = [
  {
    path: '/know-how-to-use',
    method: 'GET',
    handler: 'menu.getIfKnowHowToUse',
    authenticated: true,
  },
  {
    path: '/know-how-to-use',
    method: 'POST',
    handler: 'menu.setKnowHowToUse',
    authenticated: true,
  },
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
  {
    path: '/menu/:menuKey/:key',
    method: 'DELETE',
    handler: 'menu.removeMenuItem',
    authenticated: true,
  },
  {
    path: '/menu/:menuKey/:key',
    method: 'POST',
    handler: 'menu.updateMenuItem',
    authenticated: true,
  },
];
