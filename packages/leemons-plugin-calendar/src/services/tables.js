const table = {
  calendars: leemons.query('plugins_calendar::calendars'),
  events: leemons.query('plugins_calendar::events'),
  eventTypes: leemons.query('plugins_calendar::event-types'),
  notifications: leemons.query('plugins_calendar::notifications'),
  kanbanColumns: leemons.query('plugins_calendar::kanban-columns'),
  kanbanEventOrders: leemons.query('plugins_calendar::kanban-event-orders'),
  calendarConfigs: leemons.query('plugins_calendar::calendar-configs'),
  centerCalendarConfigs: leemons.query('plugins_calendar::center-calendar-configs'),
  calendarConfigCalendars: leemons.query('plugins_calendar::calendar-config-calendars'),
  classroomLevelCalendars: leemons.query('plugins_calendar::classroom-level-calendars'),
};

module.exports = { table };
