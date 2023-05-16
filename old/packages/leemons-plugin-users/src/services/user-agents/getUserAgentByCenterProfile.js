const { isEmpty } = require('lodash');
const { table } = require('../tables');
const {
  getRoleForRelationshipProfileCenter,
} = require('../profiles/getRoleForRelationshipProfileCenter');

/**
 * Return the user agent by userID, center and profile
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<UserAgent>}
 * */
async function getUserAgentByCenterProfile(userId, centerId, profileId, { transacting } = {}) {
  if (!isEmpty(profileId) && !isEmpty(centerId)) {
    const role = await getRoleForRelationshipProfileCenter(profileId, centerId, { transacting });

    if (!isEmpty(role) && role.id) {
      return table.userAgent.findOne({ role: role.id, user: userId }, { transacting });
    }
  } else {
    leemons.log.error('getUserAgentByCenterProfile > Missing params');
  }

  return null;
}

module.exports = { getUserAgentByCenterProfile };
