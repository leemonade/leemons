const { isEmpty } = require('lodash');
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
async function getUserAgentByCenterProfile({ userId, centerId, profileId, ctx }) {
  if (!isEmpty(profileId) && !isEmpty(centerId)) {
    const role = await getRoleForRelationshipProfileCenter({ profileId, centerId, ctx });

    if (!isEmpty(role) && role.id) {
      return ctx.tx.db.UserAgent.findOne({ role: role.id, user: userId }).lean();
    }
  } else {
    ctx.logger.error('getUserAgentByCenterProfile > Missing params');
  }

  return null;
}

module.exports = { getUserAgentByCenterProfile };
