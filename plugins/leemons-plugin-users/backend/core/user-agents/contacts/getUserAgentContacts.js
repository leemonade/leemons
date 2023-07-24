const _ = require('lodash');
const { getUserAgentsInfo } = require('../getUserAgentsInfo');
const { getUserAgentProfile } = require('../getUserAgentProfile');
const { getProfileContacts } = require('../../profiles/contacts/getProfileContacts');
const { searchUserAgents } = require('../searchUserAgents');

/**
 *
 * @public
 * @static
 * @param {string|string[]} _fromUserAgent - User agent id/s
 * @param {string|null} fromCenter
 * @param {string|null} fromProfile
 * @param {string|null} toCenter
 * @param {string|null} toProfile
 * @param {string|null} plugin
 * @param {string|null} target
 * @param {boolean} returnAgent
 * @param {boolean} withProfile
 * @param {boolean} withCenter
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]|Array.<string[]>}
 * */
async function getUserAgentContacts({
  fromUserAgent: _fromUserAgent,
  fromCenter = null,
  fromProfile = null,
  toCenter = null,
  toProfile = null,
  plugin = null,
  target = null,
  returnAgent = false,
  withProfile = false,
  withCenter = false,
  ctx,
}) {
  const userColumns = ['id', 'name', 'surnames'];
  const isArray = _.isArray(_fromUserAgent);
  const fromUserAgents = isArray ? _fromUserAgent : [_fromUserAgent];

  const userAgents = await ctx.tx.db.UserAgent.find({ id: fromUserAgents })
    .select(['id', 'role'])
    .lean();
  const userAgentsProfiles = await getUserAgentProfile({ userAgent: userAgents, ctx });
  let profileContacts = await getProfileContacts({
    fromProfile: _.map(userAgentsProfiles, 'id'),
    ctx,
  });
  profileContacts = _.uniq(_.flatten(profileContacts));

  const userAgentsForProfiles = await searchUserAgents({
    profile: toProfile ? _.intersection(profileContacts, toProfile) : profileContacts,
    center: toCenter,
    withProfile,
    withCenter,
    userColumns,
    ctx,
  });

  const query = {
    fromUserAgent: fromUserAgents,
  };

  if (fromCenter) query.fromCenter = fromCenter;
  if (fromProfile) query.fromProfile = fromProfile;
  if (toCenter) {
    query.toCenter = toCenter;
  }
  if (toProfile) {
    query.toProfile = toProfile;
  }
  if (plugin) query.plugin = plugin;
  if (target) query.target = target;

  let response = await ctx.tx.db.UserAgentContacts.find(query).lean();

  response = _.uniqBy(response, 'toUserAgent');

  let userAgentsById = null;
  if (returnAgent) {
    const _userAgents = await getUserAgentsInfo({
      userAgentIds: _.map(response, 'toUserAgent'),
      withProfile,
      withCenter,
      userColumns,
      ctx,
    });
    userAgentsById = _.keyBy(_userAgents, 'id');
  }

  let toReturn = _.map(response, ({ toUserAgent }) => {
    if (userAgentsById) return userAgentsById[toUserAgent];
    return toUserAgent;
  });

  toReturn = toReturn.concat(
    _.map(userAgentsForProfiles, (userAgentsForProfile) => {
      if (userAgentsById) return userAgentsForProfile;
      return userAgentsForProfile.id;
    })
  );

  if (userAgentsById) {
    toReturn = _.uniqBy(toReturn, 'id');
  } else {
    toReturn = _.uniq(toReturn);
  }

  return toReturn;
}

module.exports = { getUserAgentContacts };
