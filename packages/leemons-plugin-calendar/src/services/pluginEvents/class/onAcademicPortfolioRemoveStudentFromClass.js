const _ = require('lodash');

async function remove(classId, student, { transacting }) {
  await leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
    leemons.plugin.prefixPN(`class.${classId}`),
    student,
    'view',
    { transacting }
  );
}

async function onAcademicPortfolioRemoveStudentFromClass(
  data,
  { classId, studentId, transacting }
) {
  try {
    await remove(classId, studentId, { transacting });
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioRemoveStudentFromClass };
