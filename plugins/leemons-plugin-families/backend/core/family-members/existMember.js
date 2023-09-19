const _ = require('lodash');
/**
 * Add family member
 * @public
 * @static
 * @param {string} family - Family id
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existMember({ family, user, ctx }) {
  const count = await ctx.tx.db.FamilyMembers.countDocuments({ family, user });
  return !!count;
}

module.exports = { existMember };
