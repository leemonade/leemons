const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistCalendarKey } = require('../../validations/exists');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} key - key
 * @param {string|string[]} userAgentId - User agent id/s
 * @param {string|string[]} action - Action/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function grantAccessUserAgentToCalendar(key, userAgentId, action, { transacting } = {}) {
  const userAgentIds = _.isArray(userAgentId) ? userAgentId : [userAgentId];
  const actions = _.isArray(action) ? action : [action];

  await validateNotExistCalendarKey(key, { transacting });
}

module.exports = { grantAccessUserAgentToCalendar };
