const randomColor = require('randomcolor');

function onAcademicPortfolioUpdateProgram({
  // data, // unused old param
  program: { id, icon, color, name },
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const config = {
        name,
        section: ctx.prefixPN('programs'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) config.icon = icon;

      await ctx.tx.call('calendar.calendar.update', { key: ctx.prefixPN(`program.${id}`), config });

      resolve();
    } catch (e) {
      //
    }
  });
}

module.exports = { onAcademicPortfolioUpdateProgram };
