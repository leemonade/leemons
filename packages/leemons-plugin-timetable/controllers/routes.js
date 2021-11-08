module.exports = [
  // Timetable config
  {
    method: 'GET',
    path: '/config/has/:type/:id',
    handler: 'config.has',
  },
  {
    method: 'GET',
    path: '/config/:type/:id',
    handler: 'config.get',
  },
  {
    method: 'POST',
    path: '/config/:type/:id',
    handler: 'config.create',
  },
];
