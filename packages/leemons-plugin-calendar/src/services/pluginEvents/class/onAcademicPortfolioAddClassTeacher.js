async function onAcademicPortfolioAddClassTeacher(
  data,
  { class: classId, teacher, type, transacting }
) {
  try {
    const { table } = require('../../tables');
    // console.log('Vamos ha añadir profesor a calendario clase');
    const promises = [table.classCalendar.findOne({ class: classId }, { transacting })];

    promises.push(
      leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
        leemons.plugin.prefixPN(`class.${classId}`),
        teacher,
        type === 'main-teacher' ? 'owner' : 'view',
        { transacting }
      )
    );

    const [classCalendar] = await Promise.all(promises);

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
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioAddClassTeacher };
