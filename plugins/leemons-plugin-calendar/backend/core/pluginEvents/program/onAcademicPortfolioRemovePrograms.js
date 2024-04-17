async function remove({ id, soft, ctx }) {
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

async function onAcademicPortfolioRemovePrograms({ soft, programs, ctx }) {
  try {
    await Promise.all(programs.map(({ id }) => remove({ id, soft, ctx })));
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioRemovePrograms };
