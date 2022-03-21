module.exports = [
  {
    path: '/know-how-to-use',
    method: 'GET',
    handler: 'menu.getIfKnowHowToUse',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  {
    path: '/know-how-to-use',
    method: 'POST',
    handler: 'menu.setKnowHowToUse',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  /**
   * Menu
   * */
  {
    path: '/menu/:key',
    method: 'GET',
    handler: 'menu.getMenu',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  {
    path: '/menu/:key/add-item',
    method: 'POST',
    handler: 'menu.addMenuItem',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  {
    path: '/menu/:key/re-order',
    method: 'POST',
    handler: 'menu.reOrder',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  {
    path: '/menu/:menuKey/:key',
    method: 'DELETE',
    handler: 'menu.removeMenuItem',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
  {
    path: '/menu/:menuKey/:key',
    method: 'POST',
    handler: 'menu.updateMenuItem',
    authenticated: true,
    disableUserAgentDatasetCheck: true,
  },
];
