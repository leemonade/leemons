const _ = require('lodash');
const { forEach, forIn } = require('lodash');
const { table } = require('../tables');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');

/**
 * Return centers for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<array>}
 * */
async function _centers(user, { transacting } = {}) {
  const userAgentsIds = await table.userAgent.find(
    { user, $or: [{ disabled_$null: true }, { disabled: false }] },
    { columns: ['id'], transacting }
  );
  const userAgents = await getUserAgentsInfo(_.map(userAgentsIds, 'id'), {
    withProfile: true,
    withCenter: true,
    transacting,
  });
  const values = {};
  forEach(userAgents, (userAgent) => {
    if (userAgent.center) {
      if (!values[userAgent.center.id]) {
        values[userAgent.center.id] = {
          ...userAgent.center,
          profiles: [],
        };
      }
      values[userAgent.center.id].profiles.push(userAgent.profile);
    }
  });
  const results = [];
  forIn(values, (value) => {
    results.push(value);
  });
  return results;
}

module.exports = { centers: _centers };
