const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const slugify = require('slugify');
const existByName = require('./existByName');
const { validateRoleType } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');

/**
 * A "role" in the leemons context represents a collection of permissions and responsibilities designated to a user or a group of users.
 *
 * Roles are pivotal in managing access control within the platform, dictating the actions that users are permitted to
 * execute based on their assigned roles.
 *
 * Each role is associated with a set of permissions that define allowed or denied actions for its holders.
 * Roles can be linked to specific centers (organizational units), profiles (user types with distinct attributes and permissions),
 * or be universally applicable across the platform. This system enables efficient and scalable management of user permissions,
 * allowing administrators to regulate access to different system parts and ensuring users possess only the necessary permissions
 * for their roles.
 */

/**
 * Create one role
 *
 * @private
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx - Moleculer context
 * @param {string} params.name - Name of the role
 * @param {string} params.type - Type of the role
 * @param {string} [params.description] - Description of the role
 * @param {string} [params.center] - Center ID
 * @param {string} [params.profile] - Profile ID
 * @param {Array<Object>} params.permissions - Permissions
 * @return {Promise<Role>} Created / Updated role
 * */
async function add({ name, type, description, center, profile, permissions, ctx }) {
  validateRoleType(type, ctx.callerPlugin);
  if (await existByName({ name, type, center, ctx })) {
    const error = `Role with name '${name}' and type '${type}' already exists${
      center ? ` in center ${center}` : ''
    }`;
    throw new LeemonsError(ctx, { message: error });
  }

  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);

  if (!(await manyPermissionsHasManyActions({ data: dataToCheckPermissions, ctx })))
    throw new LeemonsError(ctx, { message: `One or more permissions or his actions not exist` });

  ctx.logger.debug(`Creating role '${name}'`);

  let role = await ctx.tx.db.Roles.create({
    name,
    type,
    description,
    uri: slugify(name, { lower: true }),
  });
  role = role.toObject();
  if (center) await ctx.tx.db.RoleCenter.create({ role: role.id, center });
  if (profile) await ctx.tx.db.ProfileRole.create({ role: role.id, profile });

  await addPermissionMany({ roleId: role.id, permissions, ctx });
  return role;
}

module.exports = { add };
