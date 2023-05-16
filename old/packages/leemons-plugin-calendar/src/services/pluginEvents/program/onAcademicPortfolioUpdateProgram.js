const randomColor = require('randomcolor');

function onAcademicPortfolioUpdateProgram(
  data,
  { program: { id, icon, color, name }, transacting }
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const config = {
        name,
        section: leemons.plugin.prefixPN('programs'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) config.icon = icon;

      await leemons.plugin.services.calendar.update(
        leemons.plugin.prefixPN(`program.${id}`),
        config,
        { transacting }
      );

      resolve();
    } catch (e) {}
  });
}

module.exports = { onAcademicPortfolioUpdateProgram };
