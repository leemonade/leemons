const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateExistCalendarKey,
  validateSectionPrefix,
  validateNotExistCalendarKey,
} = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');
const { validateAddCalendar } = require('../../validations/forms');

/**
 * Update calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} config - Calendar config
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(key, config, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  validateSectionPrefix(config.section, this.calledFrom);
  validateAddCalendar(config);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendarKey(key, { transacting });
      return table.calendars.update(
        { key },
        {
          ...config,
          metadata: JSON.stringify(config.metadata),
        },
        { transacting }
      );
    },
    table.calendars,
    _transacting
  );
}

module.exports = { update };
