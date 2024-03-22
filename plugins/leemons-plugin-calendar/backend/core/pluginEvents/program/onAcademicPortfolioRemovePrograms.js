async function remove({ id, soft, ctx }) {
  // eslint-disable-next-line global-require
  const programCalendar = await ctx.tx.db.ProgramCalendar.findOne({
    program: id,
  }).lean();

  if (programCalendar) {
    await Promise.all([
      ctx.tx.call('calendar.calendar.remove', {
        id: programCalendar.calendar,
      }),
      ctx.tx.db.ProgramCalendar.deleteOne({ id: programCalendar.id }, { soft }),
    ]);
  }
}

async function onAcademicPortfolioRemovePrograms({
  // data // unused old param,
  soft,
  programs,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await Promise.all(programs.map(({ id }) => remove({ id, soft, ctx })));
      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioRemovePrograms };
