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

  console.log('calendar', calendar);
}

module.exports = { getTemporalSessions };
