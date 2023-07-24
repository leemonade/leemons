const _ = require('lodash');

/** * ES: Dice que los user agents en _fromUserAgent tienen acceso a ver a todos los user agents en _toUserAgent * @public * @static * @param {string|string[]} _fromUserAgent - User agent id/s * @param {string|string[]} _toUserAgent - User agent id/s * @param {any=} transacting - DB Transaction * @return {Promise<boolean>} * */
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
  for (let i = 0, l = fromUserAgents.length; i < l; i++) {
    const fromUserAgent = fromUserAgents[i];
    const fromCenter = roleCenterByRole[userAgentsById[fromUserAgent].role].center;
    const fromProfile = roleProfileByRole[userAgentsById[fromUserAgent].role].profile;
    for (let ii = 0, ll = toUserAgents.length; ii < ll; ii++) {
      const toUserAgent = toUserAgents[ii];
      const toCenter = roleCenterByRole[userAgentsById[toUserAgent].role].center;
      const toProfile = roleProfileByRole[userAgentsById[toUserAgent].role].profile;
      // eslint-disable-next-line no-await-in-loop
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
    }
  }
}

module.exports = { addUserAgentContacts };
