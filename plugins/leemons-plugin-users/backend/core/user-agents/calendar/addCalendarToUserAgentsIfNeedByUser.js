const _ = require('lodash');
const { getUserAgentCalendarKey } = require('./getUserAgentCalendarKey');

async function addCalendarToUserAgent({ userAgent, ctx }) {
  const calendarKey = getUserAgentCalendarKey({ userAgent, ctx });
  // ES: Añadimos calendario del agente
  // EN: Add user agent calendar
  const calendar = await ctx.tx.call('calendar.calendar.add', {
    key: calendarKey,
    config: {
      name: userAgent,
      bgColor: '#3C72C2',
      borderColor: '#4F96FF',
      section: leemons.plugin.prefixPN('calendar.user_section'),
    },
  });

  // ES: Añadimos acceso de owner al user agent a su propio calendario
  // EN: Add owner access to the user agent to its own calendar
  await ctx.tx.call('calendar.calendar.grantAccessUserAgentToCalendar', {
    key: calendarKey,
    userAgentId: userAgent,
    actionName: 'owner',
  });

  return {
    userAgent,
    calendar,
  };
}

/**
 * Add calendars to all user agents of user
 * @public
 * @static
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function addCalendarToUserAgentsIfNeedByUser({ user, ctx }) {
  // TODO, Esta funcion no deberia de existir, esto deberia de lanzar un evento de usuario creado y que el plugin de calendario lo cogiera
  const userAgents = await ctx.tx.db.UserAgent.find({ user }).lean();

  const exists = await Promise.all(
    _.map(userAgents, ({ id }) =>
      ctx.tx.call('calendar.calendar.existByKey', {
        key: id,
      })
    )
  );

  const promises = [];

  _.forEach(userAgents, ({ id }, index) => {
    if (!exists[index]) {
      promises.push(addCalendarToUserAgent({ userAgent: id, ctx }));
    }
  });

  if (promises.length) {
    await Promise.all(promises);
  }
  return true;
}

module.exports = { addCalendarToUserAgentsIfNeedByUser };
