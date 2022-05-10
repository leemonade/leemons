function onAcademicPortfolioAddClassTeacher(data, { class: classId, teacher, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const { table } = require('../../tables');
      console.log('Vamos ha añadir profesor a calendario clase');
      const [classCalendar] = await Promise.all([
        table.classCalendar.findOne({ class: classId }, { transacting }),
        leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
          leemons.plugin.prefixPN(`class.${classId}`),
          teacher,
          'owner',
          { transacting }
        ),
      ]);
      try {
        await leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
          leemons.plugin.prefixPN(`program.${classCalendar.program}`),
          teacher,
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

module.exports = { onAcademicPortfolioAddClassTeacher };
