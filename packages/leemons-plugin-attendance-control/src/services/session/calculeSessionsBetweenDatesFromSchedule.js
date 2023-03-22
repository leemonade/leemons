const _ = require('lodash');

async function calculeSessionsBetweenDatesFromSchedule(start, end, schedule) {
  const scheduleByDayWeek = _.groupBy(schedule, 'dayWeek');
  const _start = new Date(start);
  const _end = new Date(end);
  const sessions = [];
  while (_start < _end) {
    _start.setDate(_start.getDate() + 1);
    const schedules = scheduleByDayWeek[_start.getDay()];
    if (schedules?.length) {
      _.forEach(schedules, (_schedule) => {
        const scheduleStart = new Date(_start);
        const scheduleEnd = new Date(_start);
        const startTime = _schedule.start.split(':');
        const endTime = _schedule.end.split(':');
        scheduleStart.setUTCHours(startTime[0]);
        scheduleStart.setUTCMinutes(startTime[1]);
        scheduleEnd.setUTCHours(endTime[0]);
        scheduleEnd.setUTCMinutes(endTime[1]);
        sessions.push({
          start: scheduleStart,
          end: scheduleEnd,
        });
      });
    }
  }
  return sessions;
}

module.exports = { calculeSessionsBetweenDatesFromSchedule };
