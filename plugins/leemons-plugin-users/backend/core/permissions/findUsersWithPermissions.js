/* eslint-disable no-param-reassign */
const { isArray, forEach, uniq, map, uniqBy, groupBy } = require('lodash');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');
const { table } = require('../tables');

/**
 * Find the users with the provided permissions
 * @public
 * @static
 * @param {string || string[]} permissions - Permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]>}
 * */
async function findUsersWithPermissions({ permissions, returnRaw, ctx }) {
  const _permissions = isArray(permissions) ? permissions : [permissions];
  const query = {
    $or: [],
  };
  forEach(_permissions, ({ actionNames, ...d }) => {
    const q = { ...d };
    if (actionNames) {
      q.actionName = actionNames;
    }
    query.$or.push(q);
  });

  const response = await ctx.tx.db.UserAgentPermission.find(query).lean();

  if (returnRaw) return response;

  const userAgentIds = uniq(map(response, 'userAgent'));
  const userAgents = await getUserAgentsInfo({ userAgentIds, ctx });
  const users = uniqBy(
    map(userAgents, (userAgent) => userAgent.user),
    '_id'
  );
  return map(users, (user) => {
    user.userAgentIds = userAgents.filter((ua) => ua.user._id === user._id).map((ua) => ua._id);
    user.permissions = uniq(
      response.filter((p) => user.userAgentIds.includes(p.userAgent)).map((p) => p.actionName)
    );
    return user;
  });
}

module.exports = { findUsersWithPermissions };
