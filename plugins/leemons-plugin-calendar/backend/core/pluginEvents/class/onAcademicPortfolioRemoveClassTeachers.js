const _ = require('lodash');

async function remove(classCalendar, teacher, { transacting }) {
  const programService = leemons.getPlugin('academic-portfolio').services.programs;
  const [insideProgram] = await Promise.all([
    programService.isUserInsideProgram({ userAgents: [{ id: teacher }] }, classCalendar.program, {
      transacting,
    }),
    leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
      leemons.plugin.prefixPN(`class.${classCalendar.class}`),
      teacher,
      ['owner', 'view'],
      { transacting }
    ),
  ]);
  if (!insideProgram) {
    await leemons.plugin.services.calendar.unGrantAccessUserAgentToCalendar(
      leemons.plugin.prefixPN(`program.${classCalendar.program}`),
      teacher,
      'view',
      { transacting }
    );
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
            promises.push(remove(classCalendarsByClass[classId], teacher, { transacting }));
          }
        });
      });
      await Promise.all(promises);
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClassTeachers };
