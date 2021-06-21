module.exports = [
  {
    path: '/localizations',
    method: 'POST',
    handler: 'localizations.get',
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
