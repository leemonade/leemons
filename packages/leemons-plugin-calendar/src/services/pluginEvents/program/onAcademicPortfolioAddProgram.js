const randomColor = require('randomcolor');
const _ = require('lodash');

async function onAcademicPortfolioAddProgram(
  data,
  { program: { id, name, color, icon }, userSession, transacting }
) {
  try {
    // eslint-disable-next-line global-require,no-shadow
    const { table } = require('../../tables');
    const config = {
      name,
      section: leemons.plugin.prefixPN('programs'),
      bgColor: color || randomColor({ luminosity: 'light' }),
    };

    if (icon) config.icon = icon;

    const calendar = await leemons.plugin.services.calendar.add(
      leemons.plugin.prefixPN(`program.${id}`),
      config,
      { transacting }
    );

    if (userSession) {
      try {
        await leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
          leemons.plugin.prefixPN(`program.${id}`),
          _.map(userSession.userAgents, 'id'),
          'owner',
          { transacting }
        );
      } catch (e) {
        console.error(e);
      }
    }

    await table.programCalendar.create(
      {
        program: id,
        calendar: calendar.id,
      },
      { transacting }
    );
  } catch (e) {
    console.error(e);
  }
}

module.exports = { onAcademicPortfolioAddProgram };
