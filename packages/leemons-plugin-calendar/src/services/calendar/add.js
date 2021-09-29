const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateExistCalendarKey } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(key, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistCalendarKey(key, { transacting });

      const permissionConfig = getPermissionConfig(key);
      const calendar = await table.calendars.create({ key }, { transacting });
      await leemons
        .getPlugin('users')
        .services.permissions.addItem(calendar.id, permissionConfig.type, permissionConfig.all, {
          isCustomPermission: true,
          transacting,
        });

      return calendar;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
