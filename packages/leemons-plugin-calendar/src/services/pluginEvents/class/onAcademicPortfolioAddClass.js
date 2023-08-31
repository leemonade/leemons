const randomColor = require('randomcolor');

async function onAcademicPortfolioAddClass(
  data,
  {
    class: {
      id,
      color,
      program,
      groups,
      subject: { name, icon, internalId },
    },
    transacting,
  }
) {
  try {
    // eslint-disable-next-line global-require,no-shadow
    const { table } = require('../../tables');
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

    const calendar = await leemons.plugin.services.calendar.add(
      leemons.plugin.prefixPN(`class.${id}`),
      config,
      { transacting }
    );

    await table.classCalendar.create(
      {
        class: id,
        program,
        calendar: calendar.id,
      },
      { transacting }
    );
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioAddClass };
