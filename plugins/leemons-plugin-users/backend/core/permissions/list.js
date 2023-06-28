const _ = require('lodash');

/**
 * Return all permits with his actions in bbdd
 * @public
 * @static
 * */
async function list({ ctx }) {
  const [permissions, permissionActions] = await Promise.all([
    ctx.tx.db.Permissions.find().lean(),
    ctx.tx.db.PermissionAction.find().lean(),
  ]);

  let permission;
  _.forEach(permissions, (_permission) => {
    permission = _permission;
    permission.actions = _.map(
      _.filter(permissionActions, {
        permissionName: permission.permissionName,
      }),
      'actionName'
    );
  });

  return permissions;
}

module.exports = { list };
