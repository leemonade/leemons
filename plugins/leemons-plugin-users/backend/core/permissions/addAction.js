const { LeemonsError } = require('@leemons/error');
const { exist: actionExist } = require('../actions');
const { exist: permissionExist } = require('./exist');
const { hasAction: permissionHasAction } = require('./hasAction');
/**
 * Create multiple permissions
 * @public
 * @static
 * @param {string} permissionName - Permission to add action
 * @param {string} actionName - Action to add
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addAction({ permissionName, actionName, ctx }) {
  const values = await Promise.all([
    actionExist({ actionName, ctx }),
    permissionExist({ permissionName, ctx }),
    permissionHasAction({ permissionName, actionName, ctx }),
  ]);
  if (!values[0]) throw new LeemonsError(ctx, { message: `There is no '${actionName}' action` });
  if (!values[1])
    throw new LeemonsError(ctx, { message: `There is no '${permissionName}' permission` });
  if (values[2])
    throw new LeemonsError(ctx, {
      message: `Already exist the permission '${permissionName}' with the action '${actionName}'`,
    });

  ctx.logger.debug(`Adding action '${actionName}' for permission '${permissionName}'`);
  const permissionActionDoc = await ctx.tx.db.PermissionAction.create({
    permissionName,
    actionName,
  });
  return permissionActionDoc.toObject();
}

module.exports = { addAction };
