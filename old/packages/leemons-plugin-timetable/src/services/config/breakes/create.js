const timeToDayjs = require('../../../helpers/dayjs/timeToDayjs');

const breaksTable = leemons.query('plugins_timetable::breaks');

module.exports = async function create(config, breaks, { transacting } = {}) {
  // Validate
  if (!Array.isArray(breaks)) {
    throw new Error('Breaks must be an array');
  }

  breaks.forEach((breakItem) => {
    const startTime = timeToDayjs(breakItem.start);
    const endTime = timeToDayjs(breakItem.end);

    // Validate name is a string and not empty
    if (typeof breakItem.name !== 'string' || !breakItem.name.length) {
      throw new Error('Break name must be a string and not empty');
    }

    if (!startTime) {
      throw new Error('Start time is invalid, must be HH:mm');
    }

    if (!endTime) {
      throw new Error('End time is invalid, must be HH:mm');
    }

    // If it starts before the group start time or ends after the group end time,
    // it means that the break is not between the group time, because we ensure
    // that the break' end time is after the break' start time
    if (startTime.isBefore(config.start) || endTime.isAfter(config.end)) {
      throw new Error('Breaks must be between start and end time');
    }
    if (startTime.isAfter(endTime)) {
      throw new Error('Breaks end time must be after start time');
    }
  });

  // Create breaks
  return breaksTable.createMany(
    breaks.map((_break) => ({
      timetable: config.id,
      start: _break.start,
      end: _break.end,
      name: _break.name,
    })),
    { transacting }
  );
};
