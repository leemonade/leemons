const randomColor = require('randomcolor');

function onAcademicPortfolioUpdateClass(
  data,
  {
    class: {
      id,
      color,
      groups,
      subject: { name, icon },
    },
    transacting,
  }
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const config = {
        name: `${name}${groups?.abbreviation ? ` (${groups.abbreviation})` : ''}`,
        section: leemons.plugin.prefixPN('classes'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) {
        config.icon = await leemons.getPlugin('leebrary').services.assets.getCoverUrl(icon.id);
      }

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
