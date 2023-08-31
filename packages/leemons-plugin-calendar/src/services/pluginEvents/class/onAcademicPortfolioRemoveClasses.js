const _ = require('lodash');

async function removeStudentFromProgramIfNeed(program, userAgentId, { transacting }) {
  const programService = leemons.getPlugin('academic-portfolio').services.programs;
  const insideProgram = await programService.isUserInsideProgram(
    { userAgents: [{ id: userAgentId }] },
    program,
    {
      transacting,
    }
  );
  if (!insideProgram) {
    await leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
      leemons.plugin.prefixPN(`program.${program}`),
      userAgentId,
      'view',
      { transacting }
    );
  }
}

async function remove(classe, { transacting }) {
  // eslint-disable-next-line global-require
  const { table } = require('../../tables');
  const classCalendar = await table.classCalendar.findOne(
    {
      class: classe.id,
    },
    { transacting }
  );

  if (classCalendar) {
    const promises = [];
    _.forEach(classCalendar.students, (student) => {
      promises.push(
        removeStudentFromProgramIfNeed(classCalendar.program, student, { transacting })
      );
    });
    _.forEach(classCalendar.parentStudents, (student) => {
      promises.push(
        removeStudentFromProgramIfNeed(classCalendar.program, student, { transacting })
      );
    });
    _.forEach(classCalendar.teachers, ({ teacher }) => {
      promises.push(
        removeStudentFromProgramIfNeed(classCalendar.program, teacher, { transacting })
      );
    });
    await Promise.all([
      leemons.plugin.services.calendar.remove(classCalendar.calendar, { transacting }),
      table.classCalendar.delete({ id: classCalendar }, { transacting }),
      ...promises,
    ]);
  }
}

async function onAcademicPortfolioRemoveClasses(data, { classes, transacting }) {
  try {
    await Promise.all(classes.map((classe) => remove(classe, { transacting })));
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioRemoveClasses };
