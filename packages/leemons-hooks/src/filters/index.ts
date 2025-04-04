import chalk from "chalk";
import _ from "lodash";
import type { EventHandlerMap } from "../types";

const filters: EventHandlerMap = {};

// Gets the filters for an event, if not defined, return defaultValue
function getFilters(
  eventName: string,
  defaultValue: Function[] = []
): Function[] {
  return _.get(filters, eventName, defaultValue);
}

// Appends a new filter to the filters object
function setFilter(eventName: string, func: Function): void {
  const eventFilters = getFilters(eventName, undefined);
  if (!eventFilters) {
    _.set(filters, eventName, [func]);
  } else {
    eventFilters.push(func);
  }
}

// Registers a new filter
function registerFilter(eventName: string, func: Function): void {
  if (!_.isFunction(func)) {
    throw new Error("All the filters must be functions");
  }

  setFilter(eventName, func);

  leemons.log.debug(
    chalk`A new {magenta filter} for the event {green ${eventName}} has been registered`
  );
}

function unregisterFilter(eventName: string, func: Function): Function[] {
  if (!_.isFunction(func)) {
    throw new Error("All the filters must be functions");
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

export const addFilter = registerFilter;
export const removeFilter = unregisterFilter;
export const getFiltersClone = (
  eventName: string,
  defaultValue: Function[] = []
): Function[] => _.clone(getFilters(eventName, defaultValue));
