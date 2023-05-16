const _ = require('lodash');
const { table } = require('../../tables');
const { getUserAgentCalendarKey } = require('./getUserAgentCalendarKey');

async function addCalendarToUserAgent(userAgent, { transacting } = {}) {
  const calendarKey = getUserAgentCalendarKey(userAgent);
  // ES: Añadimos calendario del agente
  // EN: Add user agent calendar
  const calendar = await leemons.getPlugin('calendar').services.calendar.add(
    calendarKey,
    {
      name: userAgent,
      bgColor: '#3C72C2',
      borderColor: '#4F96FF',
      section: leemons.plugin.prefixPN('calendar.user_section'),
    },
    { transacting }
  );
  // ES: Añadimos acceso de owner al user agent a su propio calendario
  // EN: Add owner access to the user agent to its own calendar
  await leemons
    .getPlugin('calendar')
    .services.calendar.grantAccessUserAgentToCalendar(calendarKey, userAgent, 'owner', {
      transacting,
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
async function addCalendarToUserAgentsIfNeedByUser(user, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const userAgents = await table.userAgent.find({ user }, { transacting });
      const exists = await Promise.all(
        _.map(userAgents, ({ id }) =>
          leemons
            .getPlugin('calendar')
            .services.calendar.existByKey(getUserAgentCalendarKey(id), { transacting })
        )
      );

      const promises = [];

      _.forEach(userAgents, ({ id }, index) => {
        if (!exists[index]) {
          promises.push(addCalendarToUserAgent(id, { transacting }));
        }
      });

      if (promises.length) {
        await Promise.all(promises);
      }
      return true;
    },
    table.users,
    _transacting
  );
}

module.exports = { addCalendarToUserAgentsIfNeedByUser };
