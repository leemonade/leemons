/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./calendar-config-calendars'),
  ...require('./center-calendar-configs'),
  ...require('./kanban-event-orders'),
  ...require('./program-calendar'),
  ...require('./calendar-configs'),
  ...require('./kanban-columns'),
  ...require('./event-calendar'),
  ...require('./class-calendar'),
  ...require('./notifications'),
  ...require('./event-types'),
  ...require('./calendars'),
  ...require('./events'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      CalendarConfigCalendars: models.calendarConfigCalendarsModel,
      CenterCalendarConfigs: models.centerCalendarConfigsModel,
      KanbanEventOrders: models.kanbanEventOrdersModel,
      ProgramCalendar: models.programCalendarModel,
      CalendarConfigs: models.calendarConfigsModel,
      KanbanColumns: models.kanbanColumnsModel,
      EventCalendar: models.eventCalendarModel,
      ClassCalendar: models.classCalendarModel,
      Notifications: models.notificationsModel,
      EventTypes: models.eventTypesModel,
      Calendars: models.calendarsModel,
      Events: models.eventsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::calendar_KeyValue' }),
    };
  },
};
