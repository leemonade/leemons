const { LeemonsError } = require('@leemons/error');
const randomColor = require('randomcolor');

async function processAcademicPortfolioAddClass({ id, program, ctx, config }) {
  try {
    const calendar = await ctx.tx.call('calendar.calendar.add', {
      key: ctx.prefixPN(`class.${id}`),
      config,
    });

    await ctx.tx.db.ClassCalendar.create({
      class: id,
      program,
      calendar: calendar.id,
    });
  } catch (e) {
    throw new LeemonsError(ctx, { message: 'Error adding calendar', cause: e });
  }
}

function onAcademicPortfolioAddClass({
  class: {
    id,
    color,
    program,
    subject: { internalId },
  },
  displayName,
  ctx,
}) {
  const config = {
    name: displayName,
    section: ctx.prefixPN('classes'),
    bgColor: color || randomColor({ luminosity: 'light' }),
    metadata: { internalId },
  };

  return processAcademicPortfolioAddClass({
    id,
    program,
    ctx,
    config,
  });
}

module.exports = { onAcademicPortfolioAddClass };
