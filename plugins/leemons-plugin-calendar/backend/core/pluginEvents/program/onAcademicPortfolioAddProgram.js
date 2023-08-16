const randomColor = require('randomcolor');
const _ = require('lodash');

const {
  add,
  grantAccessUserAgentToCalendar,
} = require('../../calendar/grantAccessUserAgentToCalendar');

function onAcademicPortfolioAddProgram({
  // data, //unused old param
  program: { id, name, color, icon },
  userSession,
  ctx,
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      // eslint-disable-next-line global-require,no-shadow
      const config = {
        name,
        section: ctx.prefixPN('programs'),
        bgColor: color || randomColor({ luminosity: 'light' }),
      };

      if (icon) config.icon = icon;

      const calendar = await add({ key: ctx.prefixPN(`program.${id}`), config, ctx });

      if (userSession) {
        try {
          await grantAccessUserAgentToCalendar({
            key: ctx.prefixPN(`program.${id}`),
            userAgentId: _.map(userSession.userAgents, 'id'),
            actionName: 'owner',
            ctx,
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }

      await ctx.tx.db.ProgramCalendar.create({
        program: id,
        calendar: calendar.id,
      });

      resolve();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddProgram };
