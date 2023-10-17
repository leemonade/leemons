const _ = require('lodash');
const chalk = require('chalk');

const actions = {};

// Gets the actions for an event, if not defined, return defaultValue
function getActions(eventName, defaultValue = []) {
  return _.get(actions, eventName, defaultValue);
}

// Appends a new action to the actions object
function setAction(eventName, func) {
  const eventActions = getActions(eventName, null);
  if (!eventActions) {
    _.set(actions, eventName, [func]);
  } else {
    eventActions.push(func);
  }
}

// Registers a new action
function registerAction(eventName, func) {
  if (!_.isFunction(func)) {
    throw new Error('All the actions must be functions');
  }

  setAction(eventName, func);

  leemons.log.debug(
    chalk`A new {magenta action} for the event {green ${eventName}} has been registered`
  );
}

function unregisterAction(eventName, func) {
  if (!_.isFunction(func)) {
    throw new Error('All the actions must be functions');
  }

  const eventActions = getActions(eventName, []);
  return eventActions
    .map((el, pos) => ({
      pos,
      el,
    }))
    .filter(({ el }) => el === func)
    .map(({ pos, el }) => {
      eventActions.splice(pos, 1);
      leemons.log.debug(
        chalk`An {magenta action} for the event {green ${eventName}} has been unregistered`
      );
      return el;
    });
}

module.exports = {
  addAction: registerAction,
  removeAction: unregisterAction,
  getActions: (eventName, defaultValue = []) => _.clone(getActions(eventName, defaultValue)),
};
