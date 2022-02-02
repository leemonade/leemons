async function remove(id, { transacting }) {
  // eslint-disable-next-line global-require
  const { table } = require('../tables');
  const classCalendar = await table.classCalendar.findOne(
    {
      class: id,
    },
    { transacting }
  );

  if (classCalendar) {
    await leemons.plugin.services.calendar.remove(classCalendar.calendar, { transacting });
  }
}

async function onAcademicPortfolioRemoveClasses(data, { classes, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await Promise.all(classes.map(({ id }) => remove(id, { transacting })));
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemoveClasses };
