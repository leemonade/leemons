const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return true if the specific user session is family member of the specific family
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any} userSession - User session
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function isFamilyMember(familyId, userSession, { transacting } = {}) {
  const count = await table.familyMembers.count(
    {
      family: familyId,
      user: _.isString(userSession) ? userSession : userSession.id,
    },
    { transacting }
  );
  return !!count;
}

module.exports = { isFamilyMember };
