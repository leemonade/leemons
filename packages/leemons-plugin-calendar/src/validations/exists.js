const { exist: existCalendar } = require('../services/calendar/exist');
const { exist: existEventType } = require('../services/event-types/exist');

async function validateExistCalendarKey(key, { transacting } = {}) {
  if (await existCalendar(key, { transacting }))
    throw new Error(`Calendar '${key}' already exists`);
}

async function validateNotExistCalendarKey(key, { transacting } = {}) {
  if (!(await existCalendar(key, { transacting }))) throw new Error(`Calendar '${key}' not exists`);
}

async function validateExistEventTypeKey(key, { transacting } = {}) {
  if (await existEventType(key, { transacting }))
    throw new Error(`Event type '${key}' already exists`);
}

async function validateNotExistEventTypeKey(key, { transacting } = {}) {
  if (!(await existEventType(key, { transacting })))
    throw new Error(`Event type '${key}' not exists`);
}

function validateKeyPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The key must begin with ${calledFrom}`);
}

function validateSectionPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The section must begin with ${calledFrom}`);
}

module.exports = {
  validateExistCalendarKey,
  validateNotExistCalendarKey,
  validateExistEventTypeKey,
  validateNotExistEventTypeKey,
  validateKeyPrefix,
  validateSectionPrefix,
};
