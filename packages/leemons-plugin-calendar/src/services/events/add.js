const _ = require('lodash');
const { table } = require('../tables');
const {
  validateNotExistCalendarKey,
  validateExistCalendarKey,
} = require('../../validations/exists');
const { validateAddEvent } = require('../../validations/forms');
const { detailByKey, getPermissionConfig } = require('../calendar');
const { addNexts } = require('../notifications');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} event - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(key, event, { transacting: _transacting } = {}) {
  validateAddEvent(event);

  return global.utils.withTransaction(
    async (transacting) => {
      const permissionConfig = getPermissionConfig(key);
      const calendar = await detailByKey(key, { transacting });
      const event = await table.events.create({ calendar: calendar.id, ...event }, { transacting });
      await leemons
        .getPlugin('users')
        .services.permissions.addItem(
          event.id,
          permissionConfig.typeEvent,
          permissionConfig.allEvent,
          {
            isCustomPermission: true,
            transacting,
          }
        );
      await addNexts(event.id, { transacting });
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
