const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return all permits with his actions in bbdd
 * @public
 * @static
 * */
async function list() {
  const [permissions, permissionActions] = await Promise.all([
    table.permissions.find(),
    table.permissionAction.find(),
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
