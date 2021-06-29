module.exports = [
  {
    path: '/common',
    method: 'POST',
    handler: 'common.get',
  },
  {
    path: '/locale',
    method: 'POST',
    handler: 'locale.add',
  },
  {
    path: '/locales',
    method: 'GET',
    handler: 'locale.list',
  },
];
