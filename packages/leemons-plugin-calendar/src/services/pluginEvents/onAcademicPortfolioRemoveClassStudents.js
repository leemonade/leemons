const _ = require('lodash');

async function remove(classId, student, { transacting }) {
  await leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
    leemons.plugin.prefixPN(`class.${classId}`),
    student,
    'view',
    { transacting }
  );
}

function onAcademicPortfolioRemoveClassStudents(data, { classIds, classStudents, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const promises = [];
      _.forEach(classIds, (classId) => {
        _.forEach(classStudents, (student) => {
          promises.push(remove(classId, student, { transacting }));
        });
      });
      await Promise.all(promises);
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClassStudents };
