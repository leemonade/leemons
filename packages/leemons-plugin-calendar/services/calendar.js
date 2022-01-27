const calendar = require('../src/services/calendar');
const events = require('../src/services/events');
const eventTypes = require('../src/services/event-types');
const { validateKeyPrefix } = require('../src/validations/exists');

function addEvent(key, event, { transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  return events.add(key, event, { transacting });
}

module.exports = {
  eventTypes: {
    event: leemons.plugin.prefixPN('event'),
    task: leemons.plugin.prefixPN('task'),
  },
  add: calendar.add,
  update: calendar.update,
  remove: calendar.remove,
  exist: calendar.exist,
  existByKey: calendar.existByKey,
  grantAccessUserAgentToCalendar: calendar.grantAccessUserAgentToCalendar,
  unGrantAccessUserAgentToCalendar: calendar.unGrantAccessUserAgentToCalendar,
  addEvent,
  addEventType: eventTypes.add,
  listEventType: eventTypes.list,
  existEventType: eventTypes.exist,
  updateEventType: eventTypes.update,
  removeEventType: eventTypes.remove,
};
