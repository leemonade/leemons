function onAcademicPortfolioAddClassStudent(data, { class: classId, student, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const { table } = require('../../tables');
      const [classCalendar] = await Promise.all([
        table.classCalendar.findOne({ class: classId }, { transacting }),
        leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
          leemons.plugin.prefixPN(`class.${classId}`),
          student,
          'view',
          { transacting }
        ),
      ]);
      try {
        await leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
          leemons.plugin.prefixPN(`program.${classCalendar.program}`),
          student,
          'view',
          { transacting }
        );
      } catch (e) {
        // console.error(e);
      }
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddClassStudent };
