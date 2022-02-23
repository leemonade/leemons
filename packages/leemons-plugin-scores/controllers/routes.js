// TODO [Importante]: Añadir autenticación y permisos
module.exports = [
  // Program config
  {
    path: '/program-config/:id',
    method: 'GET',
    handler: 'programConfig.getProgramConfig',
    authenticated: true,
  },
  {
    path: '/program-config/have-calendar/:id',
    method: 'GET',
    handler: 'programConfig.haveAcademicCalendarConfigForProgram',
    authenticated: true,
  },
];
