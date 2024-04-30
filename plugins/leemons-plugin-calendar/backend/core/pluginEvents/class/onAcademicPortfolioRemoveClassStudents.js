const _ = require('lodash');

async function remove({ classCalendar, student, ctx }) {
  const [insideProgram] = await Promise.all([
    ctx.tx.call('academic-portfolio.programs.isUserInsideProgram', {
      programId: classCalendar.program,
      userSession: { userAgents: [{ id: student }] },
    }),
    ctx.tx.call('calendar.calendar.unGrantAccessUserAgentToCalendar', {
      key: ctx.prefixPN(`class.${classCalendar.class}`),
      userAgentId: student,
      actionName: 'view',
    }),
  ]);
  if (!insideProgram) {
    await ctx.tx.call('calendar.calendar.unGrantAccessUserAgentToCalendar', {
      key: ctx.prefixPN(`program.${classCalendar.program}`),
      userAgentId: student,
      actionName: 'view',
    });
  }
}

async function onAcademicPortfolioRemoveClassStudents({ classIds, classStudents, ctx }) {
  try {
    const classCalendars = await ctx.tx.db.ClassCalendar.find({ class: classIds }).lean();
    const classCalendarsByClass = _.keyBy(classCalendars, 'class');

    const promises = [];
    _.forEach(classIds, (classId) => {
      _.forEach(classStudents, ({ student }) => {
        if (classCalendarsByClass[classId]) {
          promises.push(remove({ classCalendar: classCalendarsByClass[classId], student, ctx }));
        }
      });
    });
    await Promise.all(promises);
  } catch (e) {
    console.log('Error removing calendars after remove class students', e);
  }
}

module.exports = { onAcademicPortfolioRemoveClassStudents };
