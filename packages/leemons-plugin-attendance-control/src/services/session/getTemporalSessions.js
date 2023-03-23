const _ = require('lodash');
const { tables } = require('../tables');
const {
  calculeSessionsBetweenDatesFromSchedule,
} = require('./calculeSessionsBetweenDatesFromSchedule');

async function getTemporalSessions(classeId, { transacting } = {}) {
  const [[classe], sessions] = await Promise.all([
    leemons.getPlugin('academic-portfolio').services.classes.classByIds(classeId, { transacting }),
    tables.session.find({ class: classeId }, { transacting }),
  ]);

  const programId = classe.program;
  const courseId = classe.courses?.id;

  const calendar = await leemons
    .getPlugin('academic-calendar')
    .services.config.getConfig(programId, { transacting });

  if (!calendar) {
    return null;
  }

  // TODO: Añadir las subestapas a los filtros de fechas
  // sI LA CLASE TIENE SUBESTAPAS HAY QUE COMPROBAR QUE TODAS LAS SUBESTAPAS TENGAN FECHAS ASIGNADAS

  if (courseId && calendar.courseDates?.[courseId] && classe.schedule?.length) {
    // TODO: Filtrar para que no saque las sessiones en la fechas que hay fiestas
    return calculeSessionsBetweenDatesFromSchedule(
      calendar.courseDates[courseId].startDate,
      calendar.courseDates[courseId].endDate,
      classe.schedule,
      { sessions: _.orderBy(sessions, 'start', 'asc') }
    );
  }

  return null;
}

module.exports = { getTemporalSessions };
