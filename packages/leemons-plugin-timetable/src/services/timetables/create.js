const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const weekDays = require('../../helpers/dayjs/weekDays');

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

  const data = {
    class: classId,
    day,
    start,
    end: startTime.add(duration, 'minute').format('HH:mm'),
    duration,
  };

  const timetable = await timetableTable.create(data, { transacting });
  return timetable;
};
