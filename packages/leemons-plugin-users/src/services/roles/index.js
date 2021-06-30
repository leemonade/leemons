const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('./searchUsersWithRoleAndMarkAsReloadPermissions');
const { removePermissionAll } = require('./removePermissionAll');
const { addPermissionMany } = require('./addPermissionMany');
const { update } = require('./update');
const { add } = require('./add');
const { init } = require('./init');
const { detail } = require('./detail');

module.exports = {
  init,

  add,
  update,

  detail,

  addPermissionMany,
  deletePermissionAll: removePermissionAll,
  searchUsersWithRoleAndMarkAsReloadPermissions,
};
