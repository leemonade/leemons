const { table } = require('../tables');
const { getPermissionConfig } = require('../calendar/getPermissionConfig');
const { add } = require('./add');

/**
 * Add event to calendar if the user have access
 * @public
 * @static
 * @param {string} userSession - User session
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addFromUser(userSession, data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const userPlugin = leemons.getPlugin('users');
      const permissionConfig = getPermissionConfig(data.calendar);
      const [userPermission] = await userPlugin.services.permissions.getUserAgentPermissions(
        userSession.userAgents,
        {
          query: {
            permissionName: permissionConfig.permissionName,
          },
          transacting,
        }
      );

      if (userPermission.actionNames.indexOf('owner') < 0) {
        throw new Error('Only the owner, can add events to this calendar');
      }

      const { calendar, ...eventData } = data;

      const event = await add(calendar, eventData, { transacting });

      // TODO Si se han añadido usuarios al evento hay que añadirlos ahora (grantAccessUserAgentToCalendar)
      console.log(event);
      return event;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { addFromUser };
