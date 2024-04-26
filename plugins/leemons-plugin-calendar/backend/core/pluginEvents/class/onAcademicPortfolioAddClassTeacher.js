async function onAcademicPortfolioAddClassTeacher({ class: classId, teacher, type, ctx }) {
  try {
    const promises = [ctx.db.ClassCalendar.findOne({ class: classId }).lean()];

    promises.push(
      ctx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
        key: ctx.prefixPN(`class.${classId}`),
        userAgentId: teacher,
        actionName: type === 'main-teacher' ? 'owner' : 'view',
      })
    );

    const [classCalendar] = await Promise.all(promises);

    try {
      await ctx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
        key: ctx.prefixPN(`program.${classCalendar.program}`),
        userAgentId: teacher,
        actionName: 'view',
      });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = { onAcademicPortfolioAddClassTeacher };
