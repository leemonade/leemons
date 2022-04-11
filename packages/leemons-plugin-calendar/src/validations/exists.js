const { exist: existEvent } = require('../services/events/exist');
const { exist: existCalendar } = require('../services/calendar/exist');
const { exist: existEventType } = require('../services/event-types/exist');
const { exist: existCalendarConfig } = require('../services/calendar-configs/exist');
const { existByKey: existCalendarByKey } = require('../services/calendar/existByKey');

async function validateExistCalendarKey(key, { transacting } = {}) {
  if (await existCalendarByKey(key, { transacting }))
    throw new Error(`Calendar '${key}' already exists`);
}

async function validateNotExistCalendarKey(key, { transacting } = {}) {
  if (!(await existCalendarByKey(key, { transacting })))
    throw new Error(`Calendar '${key}' not exists`);
}

async function validateExistCalendar(id, { transacting } = {}) {
  if (await existCalendar(id, { transacting })) throw new Error(`Calendar '${id}' already exists`);
}

async function validateNotExistCalendar(id, { transacting } = {}) {
  if (!(await existCalendar(id, { transacting }))) throw new Error(`Calendar '${id}' not exists`);
}

async function validateExistEvent(id, { transacting } = {}) {
  if (await existEvent(id, { transacting })) throw new Error(`Event '${id}' already exists`);
}

async function validateNotExistEvent(id, { transacting } = {}) {
  if (!(await existEvent(id, { transacting }))) throw new Error(`Event '${id}' not exists`);
}

async function validateExistEventTypeKey(key, { transacting } = {}) {
  if (await existEventType(key, { transacting }))
    throw new Error(`Event type '${key}' already exists`);
}

async function validateNotExistEventTypeKey(key, { transacting } = {}) {
  if (!(await existEventType(key, { transacting })))
    throw new Error(`Event type '${key}' not exists`);
}

async function validateExistCalendarConfig(id, { transacting } = {}) {
  if (await existCalendarConfig(id, { transacting }))
    throw new Error(`Calendar config '${id}' already exists`);
}

async function validateNotExistCalendarConfig(id, { transacting } = {}) {
  if (!(await existCalendarConfig(id, { transacting })))
    throw new Error(`Calendar config '${id}' not exists`);
}

function validateKeyPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The key must begin with ${calledFrom}`);
}

function validateSectionPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The section must begin with ${calledFrom}`);
}

module.exports = {
  validateKeyPrefix,
  validateExistEvent,
  validateNotExistEvent,
  validateExistCalendar,
  validateSectionPrefix,
  validateNotExistCalendar,
  validateExistCalendarKey,
  validateExistEventTypeKey,
  validateNotExistCalendarKey,
  validateExistCalendarConfig,
  validateNotExistEventTypeKey,
  validateNotExistCalendarConfig,
};
