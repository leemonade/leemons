const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('./searchUsersWithRoleAndMarkAsReloadPermissions');
const { removePermissionAll } = require('./removePermissionAll');
const { addPermissionMany } = require('./addPermissionMany');
const { update } = require('./update');
const { add } = require('./add');
const { init } = require('./init');

module.exports = {
  init,

  add,
  update,

  addPermissionMany,
  deletePermissionAll: removePermissionAll,
  searchUsersWithRoleAndMarkAsReloadPermissions,
};
