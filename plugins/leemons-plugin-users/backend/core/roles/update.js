/* eslint-disable prefer-template */
const _ = require('lodash');
const exist = require('./exist');

const { validateRoleType } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');
const { removePermissionAll } = require('./permissions/removePermissionAll');

/**
 * Update one role
 * @private
 * @static
 * @param {RoleUpdate} data
 * @param {any=} _transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function update({ id, name, type, description, center, permissions, ctx }) {
  validateRoleType(type, ctx.callerPlugin);
  if (!(await exist({ id, ctx }))) throw new Error(`The role with the specified id does not exist`);

  const query = {
    name,
    type,
  };

  if (center) {
    const rolesInCenter = await ctx.tx.db.RoleCenter.find({ center }).select(['role']).lean();
    const ids = _.map(rolesInCenter, 'role');
    const index = ids.indexOf(id);
    if (index >= 0) ids.splice(index, 1);
    query.id = ids;
  } else {
    query.id = { $ne: id };
  }

  const existRole = await ctx.tx.db.Roles.countDocuments(query);
  if (existRole) {
    const error = `Role with name '${name}' and type '${type}' already exists${
      center ? ' in center ' + center : ''
    }`;
    throw new Error(error);
  }

  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);
  if (!(await manyPermissionsHasManyActions({ data: dataToCheckPermissions, ctx })))
    throw new Error(`One or more permissions or his actions not exist`);

  ctx.logger.debug(`Updating role '${name}'`);
  const [role, roleCenter] = await Promise.all([
    ctx.tx.db.Roles.findByIdAndUpdate(id, { name, type, description }, { lean: true, new: true }),
    ctx.tx.db.RoleCenter.findOne({ role: id }).lean(),
    removePermissionAll({ roleId: id, ctx }),
  ]);

  // ES: Si nos pasan que center es explicitamente null significa que quieren quitarle el centro al rol y si viene centro es que quieres actualizarlo
  if (_.isNull(center) || center) await ctx.tx.db.RoleCenter.deleteOne({ id: roleCenter.id });
  if (center) await ctx.tx.db.RoleCenter.create({ role: role.id, center });

  await addPermissionMany({ roleId: id, permissions, ctx });
  return role;
}

module.exports = { update };
