const {
  unGrantAccessUserAgentToCalendar,
} = require('../../calendar/unGrantAccessUserAgentToCalendar');

function onAcademicPortfolioAddClassStudent({
  // data //unused old param,
  class: classId,
  student,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const [classCalendar] = await Promise.all([
        ctx.tx.db.ClassCalendar.findOne({ class: classId }).lean(),
        unGrantAccessUserAgentToCalendar({
          key: ctx.prefixPN(`class.${classId}`),
          userAgentId: student,
          actionName: 'view',
          ctx,
        }),
      ]);
      try {
        await unGrantAccessUserAgentToCalendar({
          key: ctx.prefixPN(`program.${classCalendar.program}`),
          userAgentId: student,
          actionName: 'view',
          ctx,
        });
      } catch (e) {
        // console.error(e);
      }
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddClassStudent };
