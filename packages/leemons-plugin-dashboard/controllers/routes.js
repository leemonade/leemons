// TODO [Importante]: Añadir autenticación y permisos
module.exports = [
  {
    path: '/admin/realtime',
    method: 'GET',
    handler: 'dashboard.adminRealtime',
    authenticated: true,
  },
  {
    path: '/admin',
    method: 'GET',
    handler: 'dashboard.admin',
    authenticated: true,
  },
];
