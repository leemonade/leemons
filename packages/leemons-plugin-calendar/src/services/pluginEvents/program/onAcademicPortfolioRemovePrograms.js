async function remove(id, { transacting }) {
  // eslint-disable-next-line global-require
  const { table } = require('../../tables');
  const programCalendar = await table.programCalendar.findOne(
    {
      program: id,
    },
    { transacting }
  );

  if (programCalendar) {
    await Promise.all([
      leemons.plugin.services.calendar.remove(programCalendar.calendar, { transacting }),
      table.programCalendar.remove({ id: programCalendar.id }, { transacting }),
    ]);
  }
}

async function onAcademicPortfolioRemovePrograms(data, { programs, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await Promise.all(programs.map(({ id }) => remove(id, { transacting })));
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemovePrograms };
