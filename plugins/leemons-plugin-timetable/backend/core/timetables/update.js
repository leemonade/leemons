const { LeemonsError } = require('@leemons/error');
const timeToDayjs = require('../helpers/dayjs/timeToDayjs');
const validateDay = require('../helpers/dayjs/validateDay');

module.exports = async function updateTimetable({
  timetableId,
  day,
  start,
  duration,
  dayWeek,
  ctx,
}) {
  const data = {};

  if (day) {
    const lowercasedDay = day.toLowerCase();
    if (!validateDay(lowercasedDay)) {
      throw new LeemonsError(ctx, { message: 'Invalid day' });
    }
    data.day = lowercasedDay;
  }

  if (!(start && duration) && (start || duration)) {
    throw new LeemonsError(ctx, { message: 'Start and duration are required to be together' });
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
    throw new LeemonsError(ctx, { message: 'At least one of day, start and duration is required' });
  }

  return ctx.tx.db.Timetable.findOneAndUpdate(
    { id: timetableId },
    { ...data, dayWeek },
    { new: true, lean: true, upsert: true }
  );
};
