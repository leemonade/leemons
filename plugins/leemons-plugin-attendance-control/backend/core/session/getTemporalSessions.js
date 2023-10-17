/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
const _ = require('lodash');
const {
  calculeSessionsBetweenDatesFromSchedule,
} = require('./calculeSessionsBetweenDatesFromSchedule');

async function getTemporalSessions({ classeId, start, end, withAssistances, ctx }) {
  let [[classe], sessions] = await Promise.all([
    ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: classeId,
    }),
    ctx.tx.db.Session.find({ class: classeId }).lean(),
  ]);

  if (withAssistances) {
    const assistances = await ctx.tx.db.Assistance.find({ session: _.map(sessions, 'id') }).lean();
    const assistancesBySession = _.groupBy(assistances, 'session');
    _.forEach(sessions, (session) => {
      session.attendance = assistancesBySession[session.id];
    });
  }

  const programId = classe.program;
  const courseId = classe.courses?.id;

  const calendar = await ctx.tx.call('academic-calendar.config.getConfig', { program: programId });

  if (!calendar) {
    return null;
  }

  let dates = [];

  // Comprobamos si tiene las fechas del curso y que la clase tiene horario
  if (courseId && calendar.courseDates?.[courseId]) {
    dates.push({
      start: calendar.courseDates[courseId].startDate,
      end: calendar.courseDates[courseId].endDate,
    });
  }

  // Si la clase tiene subetapas comprobamos si el calendario tiene las fechas de todas las subetapas
  if (classe.substages?.length) {
    dates = [];
    _.forEach(classe.substages, ({ id }) => {
      if (calendar.substagesDates?.[courseId]?.[id]?.startDate) {
        dates.push({
          start: calendar.substagesDates[courseId][id].startDate,
          end: calendar.substagesDates[courseId][id].endDate,
        });
      }
    });
    if (dates.length !== classe.substages.length) {
      dates = [];
    }
  }

  if (dates.length && classe.schedule?.length) {
    // TODO: Filtrar para que no saque las sessiones en la fechas que hay fiestas

    let results = [];

    _.forEach(dates, ({ start: s, end: e }) => {
      results = results.concat(
        calculeSessionsBetweenDatesFromSchedule(s, e, classe.schedule, {
          sessions: _.orderBy(sessions, 'start', 'asc'),
        })
      );
    });

    results = results.concat(sessions);

    results = _.orderBy(
      _.uniqWith(results, (a, b) => {
        if (a.id && b.id) return a.id === b.id;
        return false;
      }),
      'start',
      'asc'
    );

    _.forEach(results, (result, index) => {
      result.index = index;
    });

    if (start && end) {
      const _start = new Date(start);
      const _end = new Date(end);
      results = _.filter(
        results,
        (result) => new Date(result.start) > _start && new Date(result.end) < _end
      );
    }

    return results;
  }

  return null;
}

module.exports = { getTemporalSessions };
