module.exports = [
  {
    path: '/common',
    method: 'POST',
    handler: 'common.get',
  },
  {
    path: '/common/logged',
    method: 'POST',
    handler: 'common.getLogged',
    authenticated: {
      nextWithoutSession: true,
    },
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
