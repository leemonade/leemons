const calendarService = require('../src/services/calendar');

async function getCalendar(ctx) {
  const data = await calendarService.getCalendarsToFrontend(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, ...data };
}

module.exports = {
  getCalendar,
};
