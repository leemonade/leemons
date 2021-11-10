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

  // Timetable
  {
    method: 'POST',
    path: '/timetable',
    handler: 'timetable.create',
  },
  {
    method: 'GET',
    path: '/timetable/:id',
    handler: 'timetable.get',
  },
  {
    method: 'GET',
    path: '/timetable/count/:id',
    handler: 'timetable.count',
  },
];
