const _ = require('lodash');

async function remove({ classCalendar, teacher, ctx }) {
  // const programService = leemons.getPlugin('academic-portfolio').services.programs;
  const [insideProgram] = await Promise.all([
    ctx.tx.call(
      'academic-portfolio.programs.isUserInsideProgram',
      {
        programId: classCalendar.program,
      },
      { meta: { userSession: { userAgents: [{ id: teacher }] } } }
    ),
    ctx.tx.call('calendar.calendar.unGrantAccessUserAgentToCalendar', {
      keykey: ctx.prefixPN(`class.${classCalendar.class}`),
      userAgentId: teacher,
      actionName: ['owner', 'view'],
    }),
  ]);
  if (!insideProgram) {
    await ctx.tx.call('calendar.calendar.unGrantAccessUserAgentToCalendar', {
      keykey: ctx.prefixPN(`program.${classCalendar.program}`),
      userAgentId: teacher,
      actionName: 'view',
    });
  }
}

function onAcademicPortfolioRemoveClassTeachers({
  // data // unused old param
  classIds,
  classTeachers,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const classCalendars = await ctx.tx.db.ClassCalendar.find({ class: classIds }).lean();

      const classCalendarsByClass = _.keyBy(classCalendars, 'class');

      const promises = [];
      _.forEach(classIds, (classId) => {
        _.forEach(classTeachers, ({ teacher }) => {
          if (classCalendarsByClass[classId]) {
            promises.push(remove({ classCalendar: classCalendarsByClass[classId], teacher, ctx }));
          }
        });
      });
      await Promise.all(promises);
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClassTeachers };
