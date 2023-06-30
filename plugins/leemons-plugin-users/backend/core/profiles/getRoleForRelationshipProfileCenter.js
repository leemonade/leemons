const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

async function getRoleForRelationshipProfileCenter({ profileId, centerId, ctx }) {
  const profileRoles = await ctx.tx.db.ProfileRole.find({ profile: profileId }).lean();
  const centerRole = await ctx.tx.db.RoleCenter.findOne({
    center: centerId,
    role: _.map(profileRoles, 'role'),
  }).lean();
  if (!centerRole)
    throw new LeemonsError(ctx, {
      message: 'Consistency error, a Role must always be associsted to a center given a Profile',
    });
  return ctx.tx.db.Roles.findOne({ _id: centerRole.role }).lean();
}

module.exports = { getRoleForRelationshipProfileCenter };
