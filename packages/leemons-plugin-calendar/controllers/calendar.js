const calendarService = require('../src/services/calendar');
const eventTypesService = require('../src/services/event-types');

async function getCalendar(ctx) {
  const data = await calendarService.getCalendarsToFrontend(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, ...data };
}

async function getEventTypes(ctx) {
  const eventTypes = await eventTypesService.list();
  ctx.status = 200;
  ctx.body = { status: 200, eventTypes };
}

module.exports = {
  getCalendar,
  getEventTypes,
};
