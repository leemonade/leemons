const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const weekDays = require('../../helpers/dayjs/weekDays');
const count = require('./count');

const timetableTable = leemons.query('plugins_timetable::timetable');

module.exports = async function create(
  { class: classId, day, start, duration },
  { transacting } = {}
) {
  // TODO: check if class exists

  // Validate start time
  const startTime = timeToDayjs(start);
  if (!startTime) {
    throw new Error('Invalid start time');
  }

  // The duration must be an integer
  if (duration % 1 !== 0) {
    throw new Error('Duration must be an integer');
  }

  // The duration must be greater than 0
  if (duration <= 0) {
    throw new Error('Duration must be greater than 0');
  }

  // The day must be a valid day
  if (!weekDays.includes(day)) {
    throw new Error('Invalid day');
  }

  const endTime = startTime.add(duration, 'minute');
  const end = endTime.format('HH:mm');

  if (
    // Check if exists a timetable for this class which:
    (await count(classId, {
      // Starts before this timetable ends
      startBetween: ['00:00', end],
      // And ends after this timetable starts (add 1 minute to ignore classes ending at the same time)
      endBetween: [startTime.add(1, 'minute').format('HH:mm'), '24:00'],
      days: [day],
      transacting,
    })) > 0
  ) {
    throw new Error('This class timetable overlaps with a previous one');
  }

  const data = {
    class: classId,
    day,
    start,
    end,
    duration,
  };

  const timetable = await timetableTable.create(data, { transacting });
  return timetable;
};
