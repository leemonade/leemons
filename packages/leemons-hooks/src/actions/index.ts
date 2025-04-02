import chalk from 'chalk';
import _ from 'lodash';
import type { EventHandler, EventHandlerMap } from '../types';

const actions: EventHandlerMap = {};

// Gets the actions for an event, if not defined, return defaultValue
function getActions(eventName: string, defaultValue: EventHandler[] = []): EventHandler[] {
  return _.get(actions, eventName, defaultValue);
}

// Appends a new action to the actions object
function setAction(eventName: string, func: EventHandler): void {
  const eventActions = getActions(eventName, undefined);
  if (!eventActions) {
    _.set(actions, eventName, [func]);
  } else {
    eventActions.push(func);
  }
}

// Registers a new action
function registerAction(eventName: string, func: EventHandler): void {
  if (!_.isFunction(func)) {
    throw new Error('All the actions must be functions');
  }

  setAction(eventName, func);

  leemons.log.debug(
    chalk`A new {magenta action} for the event {green ${eventName}} has been registered`
  );
}

function unregisterAction(eventName: string, func: EventHandler): EventHandler[] {
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

export const addAction = registerAction;
export const removeAction = unregisterAction;
export const getActionsClone = (
  eventName: string,
  defaultValue: EventHandler[] = []
): EventHandler[] => _.clone(getActions(eventName, defaultValue));
