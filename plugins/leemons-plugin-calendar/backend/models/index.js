/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./calendar-config-calendars'),
  ...require('./center-calendar-configs'),
  ...require('./calendar-configs'),
  ...require('./event-calendar'),
  ...require('./class-calendar'),
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
      CalendarConfigs: models.calendarConfigsModel,
      EventCalendar: models.eventCalendarModel,
      ClassCalendar: models.classCalendarModel,
      EventTypes: models.eventTypesModel,
      Calendars: models.calendarsModel,
      Events: models.eventsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::calendar_KeyValue' }),
    };
  },
};
