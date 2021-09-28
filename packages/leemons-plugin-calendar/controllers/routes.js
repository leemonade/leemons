module.exports = [
  /**
   * Calendar
   * */
  {
    path: '/calendar',
    method: 'POST',
    handler: 'calendar.getCalendar',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar': {
        actions: ['view', 'admin'],
      },
    },
  },
  /**
   * Event types
   * */
  {
    path: '/event-types',
    method: 'GET',
    handler: 'calendar.getEventTypes',
    authenticated: true,
  },
  {
    path: '/add/event',
    method: 'POST',
    handler: 'calendar.addEvent',
    authenticated: true,
  },
  {
    path: '/update/event',
    method: 'POST',
    handler: 'calendar.updateEvent',
    authenticated: true,
  },
  {
    path: '/remove/event',
    method: 'POST',
    handler: 'calendar.removeEvent',
    authenticated: true,
  },
];
