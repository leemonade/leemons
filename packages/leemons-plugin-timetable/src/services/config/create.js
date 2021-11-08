const dayjs = require('dayjs');
const has = require('./has');

const configTable = leemons.query('plugins_timetable::config');
const breaksTable = leemons.query('plugins_timetable::breaks');

async function create(
  { entity, entityType, start, end, days, breaks, slot } = {},
  { transacting: t } = {}
) {
  // Validate data types
  if (!entity || !entityType || !start || !end || !days || !breaks || !slot) {
    throw new Error('Missing parameters');
  }

  if (!Array.isArray(days)) {
    throw new Error('Days must be an array');
  }

  if (!Array.isArray(breaks)) {
    throw new Error('Breaks must be an array');
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

  if (dayjs(start, 'HH:mm').isAfter(dayjs(end, 'HH:mm'))) {
    throw new Error('Start time must be before end time');
  }

  // Validate breaks
  breaks.forEach((breakItem) => {
    if (dayjs(breakItem.start, 'HH:mm').isAfter(dayjs(breakItem.end, 'HH:mm'))) {
      throw new Error('Breaks must be between start and end time');
    }
  });

  const lowercasedDays = days.map((day) => day.toLowerCase());

  // Database queries
  return global.utils.withTransaction(
    async (transacting) => {
      // Check if the timetable config already exists.
      if (await has(entity, entityType, { transacting })) {
        throw new Error('Timetable config already exists');
      }

      // Create config
      const config = await configTable.create(
        {
          entity,
          entityType,
          start,
          end,
          days: lowercasedDays.join(','),
          slot,
        },
        { transacting }
      );

      // Create breaks
      const _breaks = await breaksTable.createMany(
        breaks.map((_break) => ({
          timetable: config.id,
          start: _break.start,
          end: _break.end,
          name: _break.name,
        })),
        { transacting }
      );

      return { ...config, breaks: _breaks };
    },
    configTable,
    t
  );
}

module.exports = create;
