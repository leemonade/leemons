const _ = require('lodash');

/**
 * Return true if the specific user session is family member of the specific family
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any} userSession - User session
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function isFamilyMember({ familyId, ctx }) {
  const count = await ctx.tx.db.FamilyMembers.countDocuments({
    family: familyId,
    user: _.isString(ctx.meta.userSession) ? ctx.meta.userSession : ctx.meta.userSession.id,
  });
  return !!count;
}

module.exports = { isFamilyMember };
