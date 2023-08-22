const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
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
    throw new LeemonsError(ctx, { message: error });
  }

  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);

  if (!(await manyPermissionsHasManyActions({ data: dataToCheckPermissions, ctx })))
    throw new LeemonsError(ctx, { message: `One or more permissions or his actions not exist` });

  ctx.logger.info(`Creating role '${name}'`);

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
