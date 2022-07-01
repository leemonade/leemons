// TODO Añadir permisos
module.exports = [
  {
    path: '/providers',
    method: 'GET',
    handler: 'email.providers',
  },
  {
    path: '/send-test',
    method: 'POST',
    handler: 'email.sendTest',
  },
  {
    path: '/save-provider',
    method: 'POST',
    handler: 'email.saveProvider',
  },
];
