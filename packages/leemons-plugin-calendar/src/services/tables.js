const table = {
  calendars: leemons.query('plugins_calendar::calendars'),
  events: leemons.query('plugins_calendar::events'),
  eventTypes: leemons.query('plugins_calendar::event-types'),
  eventCalendar: leemons.query('plugins_calendar::event-calendar'),
  notifications: leemons.query('plugins_calendar::notifications'),
  classCalendar: leemons.query('plugins_calendar::class-calendar'),
  programCalendar: leemons.query('plugins_calendar::program-calendar'),
  kanbanColumns: leemons.query('plugins_calendar::kanban-columns'),
  kanbanEventOrders: leemons.query('plugins_calendar::kanban-event-orders'),
  calendarConfigs: leemons.query('plugins_calendar::calendar-configs'),
  centerCalendarConfigs: leemons.query('plugins_calendar::center-calendar-configs'),
  calendarConfigCalendars: leemons.query('plugins_calendar::calendar-config-calendars'),
};

module.exports = { table };
