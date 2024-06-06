const _ = require('lodash');
const { getUserAgentsInfo } = require('../getUserAgentsInfo');
const { getUserAgentProfile } = require('../getUserAgentProfile');
const { getProfileContacts } = require('../../profiles/contacts/getProfileContacts');
const { searchUserAgents } = require('../searchUserAgents');

/**
 * Retrieves the contacts associated with a given user agent or agents.
 * Allows extensive customization of the output based on the provided parameters.
 *
 * @param {object} params - The params object containing the following properties:
 * @param {string|string[]} params.fromUserAgent - The ID(s) of the user agent(s) from which to retrieve contacts.
 * @param {string|null} [params.fromCenter=null] - The center ID from which to retrieve contacts, if applicable.
 * @param {string|null} [params.fromProfile=null] - The profile ID from which to retrieve contacts, if applicable.
 * @param {string|null} [params.toCenter=null] - The center ID to which the contacts should be associated, if applicable.
 * @param {string|null} [params.toProfile=null] - The profile ID to which the contacts should be associated, if applicable.
 * @param {string|null} [params.plugin=null] - The plugin ID associated with the contacts, if applicable.
 * @param {string|null} [params.target=null] - The target ID associated with the contacts, if applicable.
 * @param {boolean} [params.returnAgent=false] - Flag indicating whether to return the agent information in the output.
 * @param {boolean} [params.withProfile=false] - Flag indicating whether to include profile information in the output.
 * @param {boolean} [params.withCenter=false] - Flag indicating whether to include center information in the output.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<object[]>} A promise that resolves to an array of contact objects.
 *
 * @description
 * Process:
 * 1. Retrieves basic information about the specified user agent(s) and their profiles.
 * 2. Retrieves contacts related to these profiles if fromProfile is provided.
 * 3. Searches for user agents that match the toProfile and toCenter criteria, optionally including profile and center information.
 * 4. Constructs a query to search in the UserAgentContacts collection based on the provided filters.
 * 5. Formats the output based on the returnAgent flag, including additional information if requested.
 *
 * This function is essential for managing and retrieving user agent contacts within the plugin, supporting various use cases from simple ID retrieval to complex queries.
 */
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
