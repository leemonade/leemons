const calendar = require('../src/services/calendar');
const events = require('../src/services/events');
const { validateKeyPrefix } = require('../src/validations/exists');

function addEvent(key, event, { transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  return events.add(key, event, { transacting });
}

module.exports = {
  add: calendar.add,
  exist: calendar.exist,
  grantAccessUserAgentToCalendar: calendar.grantAccessUserAgentToCalendar,
  addEvent,
};
