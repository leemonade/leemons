function onAcademicPortfolioAddClassTeacher({
  // data // unused old param
  class: classId,
  teacher,
  type,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      // console.log('Vamos ha añadir profesor a calendario clase');
      const promises = [ctx.tx.db.ClassCalendar.findOne({ class: classId }).lean()];

      promises.push(
        ctx.tx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
          key: ctx.prefixPN(`class.${classId}`),
          userAgentId: teacher,
          actionName: type === 'main-teacher' ? 'owner' : 'view',
        })
      );

      const [classCalendar] = await Promise.all(promises);

      try {
        await ctx.tx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
          key: ctx.prefixPN(`program.${classCalendar.program}`),
          userAgentId: teacher,
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

module.exports = { onAcademicPortfolioAddClassTeacher };
