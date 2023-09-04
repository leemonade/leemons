const _ = require('lodash');

/**
 * Find the user agents with the provided permissions
 * @public
 * @static
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} permissions - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]>}
 * */
async function findUserAgentsWithPermission({ permissions, returnUserAgents = true, ctx }) {
  const _permissions = _.isArray(permissions) ? permissions : [permissions];
  const query = {
    $or: [],
  };
  _.forEach(_permissions, ({ actionNames, ...d }) => {
    const q = { ...d };
    if (actionNames) {
      q.actionName = actionNames;
    }
    query.$or.push(q);
  });

  const response = await ctx.tx.db.UserAgentPermission.find(query).lean();
  return returnUserAgents ? _.uniq(_.map(response, 'userAgent')) : response;
}

module.exports = { findUserAgentsWithPermission };
