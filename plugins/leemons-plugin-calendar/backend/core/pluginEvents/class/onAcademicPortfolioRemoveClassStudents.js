const _ = require('lodash');

const {
  unGrantAccessUserAgentToCalendar,
} = require('../../calendar/unGrantAccessUserAgentToCalendar');

async function remove({ classCalendar, student, ctx }) {
  const [insideProgram] = await Promise.all([
    ctx.tx.call('academic-portfolio.programs.isUserInsideProgram', {
      programId: classCalendar.program,
      userSession: { userAgents: [{ id: student }] },
    }),
    unGrantAccessUserAgentToCalendar({
      key: ctx.prefixPN(`class.${classCalendar.class}`),
      userAgentId: student,
      actionName: 'view',
      ctx,
    }),
  ]);
  if (!insideProgram) {
    await unGrantAccessUserAgentToCalendar({
      key: ctx.prefixPN(`program.${classCalendar.program}`),
      userAgentId: student,
      actionName: 'view',
      ctx,
    });
  }
}

function onAcademicPortfolioRemoveClassStudents({
  // data // unused old param
  classIds,
  classStudents,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
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
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClassStudents };
