import chalk from "chalk";
import _ from "lodash";
import type { EventHandlerMap } from "../types";

const actions: EventHandlerMap = {};

// Gets the actions for an event, if not defined, return defaultValue
function getActions(
  eventName: string,
  defaultValue: Function[] = []
): Function[] {
  return _.get(actions, eventName, defaultValue);
}

// Appends a new action to the actions object
function setAction(eventName: string, func: Function): void {
  const eventActions = getActions(eventName, undefined);
  if (!eventActions) {
    _.set(actions, eventName, [func]);
  } else {
    eventActions.push(func);
  }
}

// Registers a new action
function registerAction(eventName: string, func: Function): void {
  if (!_.isFunction(func)) {
    throw new Error("All the actions must be functions");
  }

  setAction(eventName, func);

  leemons.log.debug(
    chalk`A new {magenta action} for the event {green ${eventName}} has been registered`
  );
}

function unregisterAction(eventName: string, func: Function): Function[] {
  if (!_.isFunction(func)) {
    throw new Error("All the actions must be functions");
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
  defaultValue: Function[] = []
): Function[] => _.clone(getActions(eventName, defaultValue));
