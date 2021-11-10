const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const weekDays = require('../../helpers/dayjs/weekDays');
const has = require('./has');

const configTable = leemons.query('plugins_timetable::config');
const breaksTable = leemons.query('plugins_timetable::breaks');

module.exports = async function create(
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

  if (days.some((day) => !weekDays.includes(day))) {
    throw new Error('Invalid day');
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

  // Validate breaks
  breaks.forEach((breakItem) => {
    const breakStartTime = timeToDayjs(breakItem.start);
    const breakEndTime = timeToDayjs(breakItem.end);

    if (!breakStartTime) {
      throw new Error('Start time is invalid, must be HH:mm');
    }

    if (!breakEndTime) {
      throw new Error('End time is invalid, must be HH:mm');
    }

    // If it starts before the group start time or ends after the group end time,
    // it means that the break is not between the group time, because we ensure
    // that the break' end time is after the break' start time
    if (breakStartTime.isBefore(startTime) || breakEndTime.isAfter(endTime)) {
      throw new Error('Breaks must be between start and end time');
    }
    if (breakStartTime.isAfter(breakEndTime)) {
      throw new Error('Breaks end time must be after start time');
    }
  });

  const lowercasedDays = [...new Set(days.map((day) => day.toLowerCase()))];

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
};
