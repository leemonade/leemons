// TODO [Importante]: Añadir autenticación y permisos
module.exports = [
  {
    path: '/admin',
    method: 'GET',
    handler: 'dashboard.admin',
    authenticated: true,
  },
];
