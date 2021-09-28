const _ = require('lodash');
const { table } = require('../tables');

const { validateAddEvent } = require('../../validations/forms');
const { detailByKey } = require('../calendar');
const { addNexts } = require('../notifications');
const { validateNotExistEventTypeKey } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(key, data, { transacting: _transacting } = {}) {
  validateAddEvent(data);

  // eslint-disable-next-line no-param-reassign
  data.startDate = data.startDate.slice(0, 19).replace('T', ' ');
  // eslint-disable-next-line no-param-reassign
  data.endDate = data.endDate.slice(0, 19).replace('T', ' ');

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistEventTypeKey(data.type, { transacting });

      const calendar = await detailByKey(key, { transacting });
      const event = await table.events.create(
        {
          calendar: calendar.id,
          ...data,
          data: _.isObject(data.data) ? JSON.stringify(data.data) : data.data,
        },
        { transacting }
      );
      const permissionConfig = getPermissionConfig(event.id);
      await leemons
        .getPlugin('users')
        .services.permissions.addItem(event.id, permissionConfig.type, permissionConfig.all, {
          isCustomPermission: true,
          transacting,
        });
      await addNexts(event.id, { transacting });
      return { ...event, data: _.isString(event.data) ? JSON.parse(event.data) : event.data };
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
