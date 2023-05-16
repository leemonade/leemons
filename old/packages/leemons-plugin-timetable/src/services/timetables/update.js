const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const validateDay = require('../../helpers/dayjs/validateDay');
const { table } = require('../tables');

module.exports = async function updateTimetable(
  timetableId,
  { day, start, duration, dayWeek } = {},
  { transacting } = {}
) {
  const data = {};

  if (day) {
    const lowercasedDay = day.toLowerCase();
    if (!validateDay(lowercasedDay)) {
      throw new Error('Invalid day');
    }
    data.day = lowercasedDay;
  }

  if (!(start && duration) && (start || duration)) {
    throw new Error('Start and duration are required to be together');
  }

  if (start && duration) {
    const startTime = timeToDayjs(start);
    const endTime = startTime.add(duration, 'minutes');
    const end = endTime.format('HH:mm');
    data.start = start;
    data.end = end;
    data.duration = duration;
  }

  if (!day && !start && !duration) {
    throw new Error('At least one of day, start and duration is required');
  }

  return table.timetable.set({ id: timetableId }, { ...data, dayWeek }, { transacting });
};
