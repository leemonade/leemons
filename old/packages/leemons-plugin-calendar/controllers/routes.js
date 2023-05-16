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
  {
    path: '/schedule',
    method: 'POST',
    handler: 'calendar.getSchedule',
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
  /**
   * Events
   * */
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
    path: '/update/event-subtask',
    method: 'POST',
    handler: 'calendar.updateEventSubTasks',
    authenticated: true,
  },
  {
    path: '/remove/event',
    method: 'POST',
    handler: 'calendar.removeEvent',
    authenticated: true,
  },
  /**
   * Kanban
   * */
  {
    path: '/kanban/list/columns',
    method: 'GET',
    handler: 'calendar.listKanbanColumns',
    authenticated: true,
  },
  {
    path: '/kanban/list/event/orders',
    method: 'GET',
    handler: 'calendar.listKanbanEventOrders',
    authenticated: true,
  },
  {
    path: '/kanban/save/event/orders',
    method: 'POST',
    handler: 'calendar.saveKanbanEventOrders',
    authenticated: true,
  },
  /**
   * Calendar configs
   * */
  {
    path: '/configs/add',
    method: 'POST',
    handler: 'calendar.addCalendarConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['create', 'update', 'admin'],
      },
    },
  },
  {
    path: '/configs/update/:id',
    method: 'POST',
    handler: 'calendar.updateCalendarConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['update', 'admin'],
      },
    },
  },
  {
    path: '/configs/list',
    method: 'GET',
    handler: 'calendar.listCalendarConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['view', 'admin'],
      },
    },
  },
  {
    path: '/configs/detail/:id',
    method: 'GET',
    handler: 'calendar.detailCalendarConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['view', 'admin'],
      },
    },
  },
  {
    path: '/configs/remove/:id',
    method: 'DELETE',
    handler: 'calendar.removeCalendarConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['delete', 'admin'],
      },
    },
  },
  {
    path: '/configs/centers-with-out-assign',
    method: 'GET',
    handler: 'calendar.getCentersWithOutAssign',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['view', 'admin'],
      },
    },
  },
  {
    path: '/configs/calendars/:id',
    method: 'GET',
    handler: 'calendar.getCalendarConfigCalendars',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['view', 'admin'],
      },
    },
  },
  /**
   * Config events
   * */
  {
    path: '/configs/event/add',
    method: 'POST',
    handler: 'calendar.addConfigEvent',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['create', 'update', 'admin'],
      },
    },
  },
  {
    path: '/configs/event/update',
    method: 'POST',
    handler: 'calendar.updateConfigEvent',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['update', 'admin'],
      },
    },
  },
  {
    path: '/configs/event/remove',
    method: 'POST',
    handler: 'calendar.removeConfigEvent',
    authenticated: true,
    allowedPermissions: {
      'plugins.calendar.calendar-configs': {
        actions: ['delete', 'admin'],
      },
    },
  },
];
