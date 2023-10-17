const _ = require('lodash');
const chalk = require('chalk');

const filters = {};

// Gets the filters for an event, if not defined, return defaultValue
function getFilters(eventName, defaultValue = []) {
  return _.get(filters, eventName, defaultValue);
}

// Appends a new filter to the filters object
function setFilter(eventName, func) {
  const eventFilters = getFilters(eventName, null);
  if (!eventFilters) {
    _.set(filters, eventName, [func]);
  } else {
    eventFilters.push(func);
  }
}

// Registers a new filter
function registerFilter(eventName, func) {
  if (!_.isFunction(func)) {
    throw new Error('All the filters must be functions');
  }

  setFilter(eventName, func);

  leemons.log.debug(
    chalk`A new {magenta filter} for the event {green ${eventName}} has been registered`
  );
}

function unregisterFilter(eventName, func) {
  if (!_.isFunction(func)) {
    throw new Error('All the filters must be functions');
  }

  const eventFilters = getFilters(eventName, []);
  return eventFilters
    .map((el, pos) => ({
      pos,
      el,
    }))
    .filter(({ el }) => el === func)
    .map(({ pos, el }) => {
      eventFilters.splice(pos, 1);
      leemons.log.debug(
        chalk`A {magenta filter} for the event {green ${eventName}} has been unregistered`
      );
      return el;
    });
}

module.exports = {
  addFilter: registerFilter,
  removeFilter: unregisterFilter,
  getFilters: (eventName, defaultValue = []) => _.clone(getFilters(eventName, defaultValue)),
};
