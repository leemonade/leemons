const _ = require('lodash');
const { table } = require('../../tables');
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
async function getUserAgentContacts(
  _fromUserAgent,
  {
    fromCenter = null,
    fromProfile = null,
    toCenter = null,
    toProfile = null,
    plugin = null,
    target = null,
    returnAgent = false,
    withProfile = false,
    withCenter = false,
    transacting,
  } = {}
) {
  const userColumns = ['id', 'name', 'surnames'];
  const isArray = _.isArray(_fromUserAgent);
  const fromUserAgents = isArray ? _fromUserAgent : [_fromUserAgent];

  const userAgents = await table.userAgent.find(
    { id_$in: fromUserAgents },
    { columns: ['id', 'role'], transacting }
  );
  const userAgentsProfiles = await getUserAgentProfile(userAgents, { transacting });
  let profileContacts = await getProfileContacts(_.map(userAgentsProfiles, 'id'), {
    transacting,
  });
  profileContacts = _.uniq(_.flatten(profileContacts));

  const userAgentsForProfiles = await searchUserAgents(
    {
      profile: toProfile ? _.intersection(profileContacts, toProfile) : profileContacts,
      center: toCenter,
    },
    {
      withProfile,
      withCenter,
      userColumns,
      transacting,
    }
  );

  const query = {
    fromUserAgent_$in: fromUserAgents,
  };

  if (fromCenter) query.fromCenter = fromCenter;
  if (fromProfile) query.fromProfile = fromProfile;
  if (toCenter) {
    if (_.isArray(toCenter)) {
      query.toCenter_$in = toCenter;
    } else {
      query.toCenter = toCenter;
    }
  }
  if (toProfile) {
    if (_.isArray(toProfile)) {
      query.toProfile_$in = toProfile;
    } else {
      query.toProfile = toProfile;
    }
  }
  if (plugin) query.plugin = plugin;
  if (target) query.target = target;

  let response = await table.userAgentContacts.find(query, { transacting });

  response = _.uniqBy(response, 'toUserAgent');

  let userAgentsById = null;
  if (returnAgent) {
    const userAgents = await getUserAgentsInfo(_.map(response, 'toUserAgent'), {
      withProfile,
      withCenter,
      userColumns,
      transacting,
    });
    userAgentsById = _.keyBy(userAgents, 'id');
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
