const randomColor = require('randomcolor');
const { LeemonsError } = require('@leemons/error');

async function updateClassEvent({ id, color, groups, subject: { name, icon, internalId }, ctx }) {
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

  if (icon) {
    config.icon = await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: icon.id });
  }

  await ctx.tx.call('calendar.calendar.update', {
    key: ctx.prefixPN(`class.${id}`),
    config,
  });
}

async function onAcademicPortfolioUpdateClass(classInfo) {
  try {
    await updateClassEvent(classInfo);
  } catch (e) {
    throw new LeemonsError(classInfo.ctx, { message: 'Error updating calendar', cause: e });
  }
}

module.exports = { onAcademicPortfolioUpdateClass };
