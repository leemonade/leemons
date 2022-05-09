const randomColor = require('randomcolor');

function onAcademicPortfolioAddClass(
  data,
  {
    class: {
      id,
      icon,
      color,
      program,
      classroom,
      subject: { name },
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
        name: `${name}${classroom ? ` (${classroom})` : ''}`,
        section: leemons.plugin.prefixPN('classes'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) config.icon = icon;

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
