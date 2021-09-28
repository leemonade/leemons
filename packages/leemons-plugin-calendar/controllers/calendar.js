const calendarService = require('../src/services/calendar');
const eventsService = require('../src/services/events');
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

async function addEvent(ctx) {
  const event = await eventsService.addFromUser(ctx.state.userSession, ctx.request.body.event);
  ctx.status = 200;
  ctx.body = { status: 200, event };
}

async function updateEvent(ctx) {
  const event = await eventsService.updateFromUser(
    ctx.state.userSession,
    ctx.request.body.id,
    ctx.request.body.event
  );
  ctx.status = 200;
  ctx.body = { status: 200, event };
}

async function removeEvent(ctx) {
  const event = await eventsService.removeFromUser(ctx.state.userSession, ctx.request.body.event);
  ctx.status = 200;
  ctx.body = { status: 200, event };
}

module.exports = {
  addEvent,
  removeEvent,
  updateEvent,
  getCalendar,
  getEventTypes,
};
