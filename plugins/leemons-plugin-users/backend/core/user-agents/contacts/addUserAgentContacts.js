const _ = require('lodash');

/**
 * Establishes access relationships between user agents, allowing a set of user agents (_fromUserAgent)
 * to have access to view another set of user agents (_toUserAgent). This functionality is key to managing
 * visibility and interaction among different user agents within the system, based on their roles, centers, and profiles.
 *
 * @public
 * @static
 * @param {Object} params - Function parameters.
 * @param {string|string[]} params.fromUserAgent - ID/s of the source user agent.
 * @param {string|string[]} params.toUserAgent - ID/s of the target user agent.
 * @param {string|null} [params.target=null] - Optional target parameter.
 * @param {MoleculerContext} params.ctx - Context that includes transactional and plugin information.
 * @returns {Promise<boolean>} - Promise that resolves to true if the operation is successful.
 *
 * @description
 * - Converts the input IDs of the source and target user agents into arrays to handle both single and multiple IDs.
 * - Retrieves the roles for all involved user agents and then searches for related center and profile information based on those roles.
 * - Iterates over each combination of source and target user agents, and for each pair, updates or inserts a new contact relationship in the database using the `UserAgentContacts.updateOne` method with the `upsert` option, ensuring that a new record is created if one does not already exist.
 *
 * This function is part of the core functionality of the "leemons-plugin-users" plugin, which manages user agents and their relationships within the system.
 */
async function addUserAgentContacts({
  fromUserAgent: _fromUserAgent,
  toUserAgent: _toUserAgent,
  target = null,
  ctx,
}) {
  const fromUserAgents = _.isArray(_fromUserAgent) ? _fromUserAgent : [_fromUserAgent];
  const toUserAgents = _.isArray(_toUserAgent) ? _toUserAgent : [_toUserAgent];
  const pluginName = ctx.callerPlugin;
  const allUserAgentIds = fromUserAgents.concat(toUserAgents);
  const userAgents = await ctx.tx.db.UserAgent.find({ id: allUserAgentIds })
    .select(['role', 'id'])
    .lean();
  const userAgentRoles = _.map(userAgents, 'role');
  const [roleCenter, roleProfile] = await Promise.all([
    ctx.tx.db.RoleCenter.find({ role: userAgentRoles }).select(['id', 'role', 'center']).lean(),
    ctx.tx.db.ProfileRole.find({ role: userAgentRoles }).select(['id', 'role', 'profile']).lean(),
  ]);
  const roleCenterByRole = _.keyBy(roleCenter, 'role');
  const roleProfileByRole = _.keyBy(roleProfile, 'role');
  const userAgentsById = _.keyBy(userAgents, 'id');

  await fromUserAgents.reduce(async (prevPromise, fromUserAgent) => {
    await prevPromise;
    const fromCenter = roleCenterByRole[userAgentsById[fromUserAgent].role].center;
    const fromProfile = roleProfileByRole[userAgentsById[fromUserAgent].role].profile;

    return toUserAgents.reduce(async (innerPrevPromise, toUserAgent) => {
      await innerPrevPromise;
      const toCenter = roleCenterByRole[userAgentsById[toUserAgent].role].center;
      const toProfile = roleProfileByRole[userAgentsById[toUserAgent].role].profile;

      await ctx.tx.db.UserAgentContacts.updateOne(
        {
          fromUserAgent,
          toUserAgent,
          pluginName,
          target,
        },
        {
          fromUserAgent,
          fromCenter,
          fromProfile,
          toUserAgent,
          toCenter,
          toProfile,
          pluginName,
          target,
        },
        { upsert: true }
      );
    }, Promise.resolve()); // Inicia el reduce interno con una promesa resuelta
  }, Promise.resolve()); // Inicia el reduce externo con una promesa resuelta
}

module.exports = { addUserAgentContacts };
