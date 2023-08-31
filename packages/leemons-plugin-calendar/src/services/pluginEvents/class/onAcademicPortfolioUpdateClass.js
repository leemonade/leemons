const randomColor = require('randomcolor');

async function onAcademicPortfolioUpdateClass(
  data,
  {
    class: {
      id,
      color,
      groups,
      subject: { name, icon, internalId },
    },
    transacting,
  }
) {
  try {
    const config = {
      name: `${name}${
        groups?.abbreviation && groups.abbreviation !== '-auto-' ? ` (${groups.abbreviation})` : ''
      }`,
      section: leemons.plugin.prefixPN('classes'),
      bgColor: color || randomColor({ luminosity: 'light' }),
      metadata: { internalId },
    };

    if (icon) {
      config.icon = await leemons.getPlugin('leebrary').services.assets.getCoverUrl(icon.id);
    }

    await leemons.plugin.services.calendar.update(leemons.plugin.prefixPN(`class.${id}`), config, {
      transacting,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = { onAcademicPortfolioUpdateClass };
