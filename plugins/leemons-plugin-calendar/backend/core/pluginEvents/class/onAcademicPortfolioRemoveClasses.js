const _ = require('lodash');

async function removeStudentFromProgramIfNeed({ program, userAgentId, ctx }) {
  const insideProgram = await ctx.tx.call('academic-portfolio.programs.isUserInsideProgram', {
    userSession: { userAgents: [{ id: userAgentId }] },
    programId: program,
  });
  if (!insideProgram) {
    ctx.tx.call('calendar.calendar.unGrantAccessUserAgentToCalendar', {
      key: ctx.prefixPN(`program.${program}`),
      userAgentId,
      actionName: 'view',
    });
  }
}

async function remove({ classe, ctx }) {
  // eslint-disable-next-line global-require
  const classCalendar = await ctx.tx.db.ClassCalendar.findOne({
    class: classe.id,
  }).lean();

  if (classCalendar) {
    const promises = [];
    _.forEach(classCalendar.students, (student) => {
      promises.push(
        removeStudentFromProgramIfNeed({
          program: classCalendar.program,
          userAgentId: student,
          ctx,
        })
      );
    });
    _.forEach(classCalendar.parentStudents, (student) => {
      promises.push(
        removeStudentFromProgramIfNeed({
          program: classCalendar.program,
          userAgentId: student,
          ctx,
        })
      );
    });
    _.forEach(classCalendar.teachers, ({ teacher }) => {
      promises.push(
        removeStudentFromProgramIfNeed({
          program: classCalendar.program,
          userAgentId: teacher,
          ctx,
        })
      );
    });
    await Promise.all([
      ctx.tx.call('calendar.calendar.remove', {
        id: classCalendar.calendar,
      }),
      ctx.tx.db.ClassCalendar.deleteOne({ id: classCalendar.id }),
      ...promises,
    ]);
  }
}

async function onAcademicPortfolioRemoveClasses({
  // data, // unused old param
  classes,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await Promise.all(classes.map((classe) => remove({ classe, ctx })));
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClasses };
