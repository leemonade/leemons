const _ = require('lodash');
const {table} = require('../src/services/tables');
const calendar = require('../src/services/calendar');
const events = require('../src/services/events');
const eventTypes = require('../src/services/event-types');
const {validateKeyPrefix} = require('../src/validations/exists');
const {addFromUser} = require("../src/services/events/addFromUser");

function addEvent(key, event, {transacting} = {}) {
  const keys = _.isArray(key) ? key : [key];
  // Check if keys start with 'plugins.assignables'
  _.forEach(keys, (k) => {
    if (
      !this.calledFrom.startsWith('plugins.assignables') &&
      !this.calledFrom.startsWith('plugins.bulk-template')
    ) {
      validateKeyPrefix(k, this.calledFrom);
    }
  });

  return events.add(key, event, {transacting});
}

function grantAccessUserAgentToEvent(id, userAgentId, actionName, {transacting} = {}) {
  if (!this.calledFrom.startsWith('plugins.assignables')) {
    throw new Error('You can not have access');
  }
  return events.grantAccessUserAgentToEvent(id, userAgentId, actionName, {transacting});
}

function unGrantAccessUserAgentToEvent(id, userAgentId, {actionName, transacting} = {}) {
  if (!this.calledFrom.startsWith('plugins.assignables')) {
    throw new Error('You can not have access');
  }
  return events.grantAccessUserAgentToEvent(id, userAgentId, {actionName, transacting});
}

function removeEvent(id, {transacting} = {}) {
  if (!this.calledFrom.startsWith('plugins.assignables')) {
    throw new Error('You can not have access');
  }
  return events.remove(id, {transacting});
}

function updateEvent(id, data, {calendar: _calendar, transacting} = {}) {
  if (!this.calledFrom.startsWith('plugins.assignables')) {
    throw new Error('You can not have access');
  }
  return events.update(id, data, {calendar: _calendar, transacting});
}

function getCalendarsByClass(classe) {
  return table.classCalendar.find({class_$in: _.isArray(classe) ? classe : [classe]});
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
  addEventFromUser: addFromUser,
  removeEvent,
  updateEvent,
  getCalendarsByClass,
  grantAccessUserAgentToEvent,
  unGrantAccessUserAgentToEvent,
  addEventType: eventTypes.add,
  listEventType: eventTypes.list,
  existEventType: eventTypes.exist,
  updateEventType: eventTypes.update,
  removeEventType: eventTypes.remove,
  // TODO: Remove this method when MVP-Template is removed
  getCalendars: calendar.getCalendarsToFrontend,
};
