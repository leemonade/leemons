const _ = require('lodash');

async function remove(classId, student, { transacting }) {
  await leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
    leemons.plugin.prefixPN(`class.${classId}`),
    student,
    'view',
    { transacting }
  );
}

function onAcademicPortfolioRemoveStudentFromClass(data, { classId, studentId, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await remove(classId, studentId, { transacting });
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveStudentFromClass };
