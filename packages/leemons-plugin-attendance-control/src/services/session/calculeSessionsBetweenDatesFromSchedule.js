/* eslint-disable no-param-reassign */
const _ = require('lodash');

const getDay = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

function calculeSessionsBetweenDatesFromSchedule(start, end, schedule, { sessions = [] } = {}) {
  const scheduleByDayWeek = _.groupBy(schedule, 'dayWeek');
  const _start = new Date(start);
  const _end = new Date(end);
  const results = [];
  const sessionsByDay = {};
  _.forEach(sessions, (session) => {
    const day = getDay(new Date(session.start));
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = [];
    }
    sessionsByDay[day].push({ ...session });
  });
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
        let item = {
          start: scheduleStart,
          end: scheduleEnd,
        };
        // Comprobamos si hay que remplazar el slot por una sesión ya existente en esa fecha
        if (sessionsByDay[getDay(scheduleStart)]?.length) {
          _.forEach(sessionsByDay[getDay(scheduleStart)], (session) => {
            session.start = new Date(session.start);
            session.end = new Date(session.end);
            if (session.end > scheduleStart && session.start < scheduleEnd) {
              item = session;
              return false;
            }
          });
        }
        results.push(item);
      });
    }
  }
  return results;
}

module.exports = { calculeSessionsBetweenDatesFromSchedule };
