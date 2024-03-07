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

        ctx.tx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
          key: ctx.prefixPN(`class.${classId}`),
          userAgentId: student,
          actionName: 'view',
        }),
      ]);
      try {
        await ctx.tx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
          key: ctx.prefixPN(`program.${classCalendar.program}`),
          userAgentId: student,
          actionName: 'view',
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
