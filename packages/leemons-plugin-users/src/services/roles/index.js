const searchUsersWithRoleAndMarkAsReloadPermissions = require('./searchUsersWithRoleAndMarkAsReloadPermissions');
const { removePermissionAll } = require('./removePermissionAll');
const { addPermissionMany } = require('./addPermissionMany');
const { update } = require('./update');
const { add } = require('./add');
const { detail } = require('./detail');

module.exports = {
  add,
  update,

  detail,

  addPermissionMany,
  deletePermissionAll: removePermissionAll,
  searchUsersWithRoleAndMarkAsReloadPermissions,
};
