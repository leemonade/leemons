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
async function findUsersWithPermissions(permissions, { returnRaw, transacting } = {}) {
  const _permissions = isArray(permissions) ? permissions : [permissions];
  const query = {
    $or: [],
  };
  forEach(_permissions, ({ actionNames, ...d }) => {
    const q = { ...d };
    if (actionNames) {
      q.actionName_$in = actionNames;
    }
    query.$or.push(q);
  });

  const response = await table.userAgentPermission.find(query, { transacting });

  if (returnRaw) return response;

  const userAgentIds = uniq(map(response, 'userAgent'));
  const userAgents = await getUserAgentsInfo(userAgentIds, { transacting });
  const users = uniqBy(
    map(userAgents, (userAgent) => userAgent.user),
    'id'
  );
  return map(users, (user) => {
    user.userAgentIds = userAgents.filter((ua) => ua.user.id === user.id).map((ua) => ua.id);
    user.permissions = uniq(
      response.filter((p) => user.userAgentIds.includes(p.userAgent)).map((p) => p.actionName)
    );
    return user;
  });
}

module.exports = { findUsersWithPermissions };
