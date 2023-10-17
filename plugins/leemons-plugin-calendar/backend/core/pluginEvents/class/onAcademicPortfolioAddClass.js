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
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const config = {
        name: `${name}${
          groups?.abbreviation && groups.abbreviation !== '-auto-'
            ? ` (${groups.abbreviation})`
            : ''
        }`,
        section: ctx.prefixPN('classes'),
        bgColor: color || randomColor({ luminosity: 'light' }),
        metadata: { internalId },
      };

      if (icon) {
        config.icon = await ctx.tx.call('leebrary.assets.getCoverUrl', icon.id);
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
