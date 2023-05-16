const _ = require('lodash');
const { table } = require('../tables');

/**
 * Find the user agents with the provided permissions
 * @public
 * @static
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} permissions - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]>}
 * */
async function findUserAgentsWithPermission(
  permissions,
  { returnUserAgents = true, transacting } = {}
) {
  const _permissions = _.isArray(permissions) ? permissions : [permissions];
  const query = {
    $or: [],
  };
  _.forEach(_permissions, ({ actionNames, ...d }) => {
    const q = { ...d };
    if (actionNames) {
      q.actionName_$in = actionNames;
    }
    query.$or.push(q);
  });

  const response = await table.userAgentPermission.find(query, { transacting });
  return returnUserAgents ? _.uniq(_.map(response, 'userAgent')) : response;
}

module.exports = { findUserAgentsWithPermission };
