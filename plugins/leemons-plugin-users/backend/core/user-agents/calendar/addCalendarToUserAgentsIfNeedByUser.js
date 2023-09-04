const _ = require('lodash');
const { getUserAgentCalendarKey } = require('leemons-users');

/**
 * Adds a calendar to the specified user agent.
 *
 * @async
 * @function addCalendarToUserAgent
 * @param {Object} options - Input options.
 * @param {string} options.userAgent - The user agent to which the calendar will be added.
 * @returns {Promise<Object>} A promise that resolves to an object containing the user agent and the added calendar.
 */
async function addCalendarToUserAgent({ userAgent, ctx }) {
  const calendarKey = getUserAgentCalendarKey({ userAgent });
  // ES: Añadimos calendario del agente
  // EN: Add user agent calendar
  const calendar = await ctx.tx.call('calendar.calendar.add', {
    key: calendarKey,
    config: {
      name: userAgent,
      bgColor: '#3C72C2',
      borderColor: '#4F96FF',
      section: ctx.prefixPN('calendar.user_section'),
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
 * Adds calendars to all user agents of a specific user if they do not already exist.
 *
 * @async
 * @function addCalendarToUserAgentsIfNeedByUser
 * @param {string} user - The ID of the user.
 * @param {import("moleculer").Context} ctx - The Moleculer request context.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if calendars were added to all user agents successfully.
 */
async function addCalendarToUserAgentsIfNeedByUser({ user, ctx }) {
  // TODO, Esta funcion no deberia de existir, esto deberia de lanzar un evento de usuario creado y que el plugin de calendario lo cogiera
  const userAgents = await ctx.tx.db.UserAgent.find({ user }).lean();

  const exists = await Promise.all(
    _.map(userAgents, ({ id }) =>
      ctx.tx.call('calendar.calendar.existByKey', {
        key: getUserAgentCalendarKey({ userAgent: id }),
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
