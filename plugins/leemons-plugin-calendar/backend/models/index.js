/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./calendarConfigCalendars'),
  ...require('./centerCalendarConfigs'),
  ...require('./kanbanEventOrders'),
  ...require('./programCalendar'),
  ...require('./calendarConfigs'),
  ...require('./kanbanColumns'),
  ...require('./eventCalendar'),
  ...require('./classCalendar'),
  ...require('./notifications'),
  ...require('./eventTypes'),
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
