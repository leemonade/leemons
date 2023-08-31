const randomColor = require('randomcolor');

async function onAcademicPortfolioUpdateProgram(
  data,
  { program: { id, icon, color, name }, transacting }
) {
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
  } catch (e) { }
}

module.exports = { onAcademicPortfolioUpdateProgram };
