const { LeemonsError } = require('@leemons/error');
const randomColor = require('randomcolor');

async function processAcademicPortfolioAddClass({ id, program, subject: { icon }, ctx, config }) {
  try {
    const newConfig = { ...config };
    if (icon) {
      newConfig.icon = await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: icon.id });
    }

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
    groups,
    subject: { name, icon, internalId },
  },
  ctx,
}) {
  let displayName = name;
  if (groups?.abbreviation) {
    displayName += ` (${groups.abbreviation})`;
  }

  const config = {
    name: displayName,
    section: ctx.prefixPN('classes'),
    bgColor: color || randomColor({ luminosity: 'light' }),
    metadata: { internalId },
  };

  return processAcademicPortfolioAddClass({
    id,
    color,
    program,
    groups,
    subject: { name, icon, internalId },
    ctx,
    displayName,
    config,
  });
}

module.exports = { onAcademicPortfolioAddClass };
