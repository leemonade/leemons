const _ = require('lodash');
const slugify = require('slugify');
const existByName = require('./existByName');
const { validateRoleType } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');

/**
 * Create one role
 * @private
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {RoleAdd} params.data
 * @return {Promise<Role>} Created / Updated role
 * */
async function add({ name, type, description, center, profile, permissions, ctx }) {
  validateRoleType(type, ctx.callerPlugin);
  if (await existByName({ name, type, center, ctx })) {
    const error = `Role with name '${name}' and type '${type}' already exists${
      center ? ` in center ${center}` : ''
    }`;
    throw new Error(error);
  }

  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);

  if (!(await manyPermissionsHasManyActions({ data: dataToCheckPermissions, ctx })))
    throw new Error(`One or more permissions or his actions not exist`);

  ctx.logger.info(`Creating role '${name}'`);

  const role = await ctx.tx.db.Roles.create({
    name,
    type,
    description,
    uri: slugify(name, { lower: true }),
  });
  if (center) await ctx.tx.db.RoleCenter.create({ role: role._id, center });
  if (profile) await ctx.tx.db.ProfileRole.create({ role: role._id, profile });

  await addPermissionMany({ roleId: role._id, permissions, ctx });
  return role;
}

module.exports = { add };
