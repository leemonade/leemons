const randomColor = require('randomcolor');

function onAcademicPortfolioAddClass({
  // data, //old unused param
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

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
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

      const calendar = await ctx.tx.call('calendar.calendar.add', {
        key: ctx.prefixPN(`class.${id}`),
        config,
      });

      await ctx.tx.db.ClassCalendar.create({
        class: id,
        program,
        calendar: calendar.id,
      });

      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddClass };
