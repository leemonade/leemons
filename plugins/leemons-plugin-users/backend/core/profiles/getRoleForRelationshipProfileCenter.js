const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

/**
 * Retrieves the role associated with a specific profile and center combination.
 * This function ensures that a given profile has a corresponding role within a specific center, which is essential
 * for managing access and permissions within the platform.
 *
 * @param {Object} params
 * @param {string} params.profileId - The ID of the profile for which the role is being retrieved.
 * @param {string} params.centerId - The ID of the center for which the role is being retrieved.
 * @param {Object} params.ctx - The context object, which includes the database transaction context.
 * @returns {Promise<Role>} - The role object associated with the given profile and center. If no matching role is found, an error is thrown.
 *
 * Steps:
 * 1. Fetches all roles associated with the given profileId from the ProfileRole database table.
 * 2. Searches for a role in the RoleCenter database table that matches both the centerId and any of the roles associated with the profile.
 * 3. If no matching role is found, throws a LeemonsError indicating a consistency error, suggesting that every profile should have an associated role within a given center.
 * 4. If a matching role is found, retrieves the complete role details from the Roles database table using the role ID found in step 2.
 */
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
  return ctx.tx.db.Roles.findOne({ id: centerRole.role }).lean();
}

module.exports = { getRoleForRelationshipProfileCenter };
