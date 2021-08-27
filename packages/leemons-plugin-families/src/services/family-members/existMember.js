const _ = require('lodash');
const { table } = require('../tables');

/**
 * Add family member
 * @public
 * @static
 * @param {string} family - Family id
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existMember(family, user, { transacting } = {}) {
  const count = await table.familyMembers.count({ family, user }, { transacting });
  return !!count;
}

module.exports = { existMember };
