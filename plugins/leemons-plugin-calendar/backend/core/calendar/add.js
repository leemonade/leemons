const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateExistCalendarKey,
  validateSectionPrefix,
} = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');
const { validateAddCalendar } = require('../../validations/forms');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} config - Calendar config
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(key, config, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  validateSectionPrefix(config.section, this.calledFrom);
  validateAddCalendar(config);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistCalendarKey(key, { transacting });

      const permissionConfig = getPermissionConfig(key);
      const calendar = await table.calendars.create(
        {
          key,
          ...config,
          metadata: JSON.stringify(config.metadata),
        },
        { transacting }
      );
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
