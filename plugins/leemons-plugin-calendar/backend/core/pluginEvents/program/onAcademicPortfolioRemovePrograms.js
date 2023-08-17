async function remove({ id, ctx }) {
  // eslint-disable-next-line global-require
  const programCalendar = await ctx.tx.db.ProgramCalendar.findOne({
    program: id,
  }).lean();

  if (programCalendar) {
    await Promise.all([
      ctx.tx.call('calendar.calendar.remove', {
        id: programCalendar.calendar,
      }),
      ctx.tx.db.ProgramCalendar.removeOne({ id: programCalendar.id }),
    ]);
  }
}

async function onAcademicPortfolioRemovePrograms({
  // data // unused old param,
  programs,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await Promise.all(programs.map(({ id }) => remove({ id, ctx })));
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemovePrograms };
