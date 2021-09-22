const _ = require('lodash');
const calendarService = require('../src/services/calendar');

async function getCalendar(ctx) {
  const test = await calendarService.getCalendarsToFrontend(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, test };
}

module.exports = {
  getCalendar,
};
