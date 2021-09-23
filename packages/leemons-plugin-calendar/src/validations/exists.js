const { exist: existCalendar } = require('../services/calendar/exist');

async function validateExistCalendarKey(key, { transacting } = {}) {
  if (await existCalendar(key, { transacting }))
    throw new Error(`Calendar '${key}' already exists`);
}

async function validateNotExistCalendarKey(key, { transacting } = {}) {
  if (!(await existCalendar(key, { transacting }))) throw new Error(`Calendar '${key}' not exists`);
}

function validateKeyPrefix(key, calledFrom) {
  if (!key.startsWith(calledFrom)) throw new Error(`The key must begin with ${calledFrom}`);
}

module.exports = {
  validateExistCalendarKey,
  validateNotExistCalendarKey,
  validateKeyPrefix,
};
