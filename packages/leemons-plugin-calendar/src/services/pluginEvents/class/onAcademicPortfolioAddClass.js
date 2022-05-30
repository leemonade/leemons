const randomColor = require('randomcolor');

function onAcademicPortfolioAddClass(
  data,
  {
    class: {
      id,
      color,
      program,
      group,
      subject: { name, icon },
    },
    transacting,
  }
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      // eslint-disable-next-line global-require,no-shadow
      const { table } = require('../../tables');
      const config = {
        name: `${name}${group?.abbreviation ? ` (${group?.abbreviation})` : ''}`,
        section: leemons.plugin.prefixPN('classes'),
        bgColor: color || randomColor({ luminosity: 'light' }),
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

      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddClass };
