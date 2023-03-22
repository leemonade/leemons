const {
  calculeSessionsBetweenDatesFromSchedule,
} = require('./calculeSessionsBetweenDatesFromSchedule');

async function getTemporalSessions(classeId) {
  const [classe] = await leemons
    .getPlugin('academic-portfolio')
    .services.classes.classByIds(classeId);

  const programId = classe.program;
  const courseId = classe.courses?.id;

  const calendar = await leemons
    .getPlugin('academic-calendar')
    .services.config.getConfig(programId);

  if (!calendar) {
    return null;
  }

  if (courseId && calendar.courseDates?.[courseId] && classe.schedule?.length) {
    // TODO Coger tambien las sesiones existentes y machearlas por las fechas, con que la fecha de la session este entre la fecha del temporal, se cambia el temporal por el de la sesion
    return calculeSessionsBetweenDatesFromSchedule(
      calendar.courseDates[courseId].startDate,
      calendar.courseDates[courseId].endDate,
      classe.schedule
    );
  }

  return null;
}

module.exports = { getTemporalSessions };
