module.exports = [
  // Timetable config
  {
    method: 'POST',
    path: '/config',
    handler: 'config.create',
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'config.get',
  },
  {
    method: 'GET',
    path: '/config/has',
    handler: 'config.has',
  },
  {
    method: 'PUT',
    path: '/config',
    handler: 'config.update',
  },
  {
    method: 'DELETE',
    path: '/config',
    handler: 'config.delete',
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
  {
    method: 'PUT',
    path: '/timetable/:id',
    handler: 'timetable.update',
  },
  {
    method: 'DELETE',
    path: '/timetable/:id',
    handler: 'timetable.delete',
  },
];
