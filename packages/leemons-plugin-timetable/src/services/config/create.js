const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const weekDays = require('../../helpers/dayjs/weekDays');
const has = require('./has');
const createBreaks = require('./breakes/create');
const entitiesFormat = require('../../helpers/config/entitiesFormat');

const configTable = leemons.query('plugins_timetable::config');

module.exports = async function create(
  { entities: entitiesObj, start, end, days, breaks, slot } = {},
  { transacting: t } = {}
) {
  // Validate data types
  if (!entitiesObj || !start || !end || !days || !breaks || !slot) {
    throw new Error('Missing parameters');
  }

  if (!Array.isArray(days)) {
    throw new Error('Days must be an array');
  }

  if (typeof slot !== 'number') {
    throw new Error('Slot must be a number');
  }

  if (slot <= 0) {
    throw new Error('Slot must be a positive number');
  }

  if (slot % 1 !== 0) {
    throw new Error('Slot must be an integer');
  }

  const startTime = timeToDayjs(start);
  const endTime = timeToDayjs(end);

  if (!startTime) {
    throw new Error('Start time is invalid, must be HH:mm');
  }

  if (!endTime) {
    throw new Error('End time is invalid, must be HH:mm');
  }

  if (startTime.isAfter(endTime)) {
    throw new Error('Start time must be before end time');
  }

  const lowercasedDays = [...new Set(days.map((day) => day.toLowerCase()))];

  if (lowercasedDays.some((day) => !weekDays.includes(day))) {
    throw new Error('Invalid day');
  }

  // Validate entities
  const { entityTypes, entities } = entitiesFormat(entitiesObj);

  // Database queries
  return global.utils.withTransaction(
    async (transacting) => {
      // Check if the timetable config already exists.
      if (await has(entitiesObj, { transacting })) {
        throw new Error('Timetable config already exists');
      }

      // Create config
      const config = await configTable.create(
        {
          entityTypes,
          entities,
          start,
          end,
          days: lowercasedDays.join(','),
          slot,
        },
        { transacting }
      );

      // Register breaks
      const _breaks = await createBreaks(config, breaks, { transacting });

      return { ...config, breaks: _breaks };
    },
    configTable,
    t
  );
};
