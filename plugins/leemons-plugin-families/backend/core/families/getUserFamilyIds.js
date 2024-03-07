const _ = require('lodash');

async function getUserFamilyIds({ user, ctx }) {
  const familyMembers = await ctx.tx.db.FamilyMembers.find({ user }).lean();
  const familyIds = _.map(familyMembers, 'family');
  return _.uniq(familyIds);
}

module.exports = { getUserFamilyIds };
