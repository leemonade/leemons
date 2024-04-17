const randomColor = require('randomcolor');

function onAcademicPortfolioUpdateClass({
  // data, // old unused param
  class: {
    id,
    color,
    groups,
    subject: { name, icon, internalId },
  },
  ctx,
}) {
  let displayName = name;
  if (groups?.abbreviation) {
    displayName += ` (${groups.abbreviation})`;
  }
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
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

      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      reject(e);
    }
  });
}

module.exports = { onAcademicPortfolioUpdateClass };
