const randomColor = require('randomcolor');

function onAcademicPortfolioUpdateClass(
  data,
  {
    class: {
      id,
      icon,
      color,
      classroom,
      subject: { name },
    },
    transacting,
  }
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const config = {
        name: `${name}${classroom ? ` (${classroom})` : ''}`,
        section: leemons.plugin.prefixPN('classes'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) config.icon = icon;

      await leemons.plugin.services.calendar.update(
        leemons.plugin.prefixPN(`class.${id}`),
        config,
        { transacting }
      );

      resolve();
    } catch (e) {}
  });
}

module.exports = { onAcademicPortfolioUpdateClass };
