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
];
