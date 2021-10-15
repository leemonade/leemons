const _ = require('lodash');
const { table } = require('../tables');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');

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
  const isArray = _.isArray(_fromUserAgent);
  const fromUserAgents = isArray ? _fromUserAgent : [_fromUserAgent];
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
      userColumns: ['id', 'name', 'surnames'],
      transacting,
    });
    userAgentsById = _.keyBy(userAgents, 'id');
  }

  if (isArray) {
    const responseByFromUserAgent = _.groupBy(response, 'fromUserAgent');
    return _.map(fromUserAgents, (fromUserAgent) => {
      return _.map(responseByFromUserAgent[fromUserAgent], ({ toUserAgent }) => {
        if (userAgentsById) return userAgentsById[toUserAgent];
        return toUserAgent;
      });
    });
  } else {
    return _.map(response, ({ toUserAgent }) => {
      if (userAgentsById) return userAgentsById[toUserAgent];
      return toUserAgent;
    });
  }
}

module.exports = { getUserAgentContacts };
