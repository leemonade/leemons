const randomColor = require('randomcolor');
const { update } = require('../../calendar/update');

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

      await update({ key: ctx.prefixPN(`program.${id}`), config, ctx });

      resolve();
    } catch (e) {
      //
    }
  });
}

module.exports = { onAcademicPortfolioUpdateProgram };
