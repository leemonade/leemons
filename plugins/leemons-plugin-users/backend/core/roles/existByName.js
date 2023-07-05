const _ = require('lodash');

async function existByName({ name, type, center, ctx }) {
  const query = { name, type };
  if (center) {
    const rolesInCenter = await ctx.tx.db.RoleCenter.find({ center }).select(['role']).lean();
    query.id = _.map(rolesInCenter, 'role');
  }
  const response = await await ctx.tx.db.Roles.countDocuments(query);
  return !!response;
}

module.exports = existByName;
