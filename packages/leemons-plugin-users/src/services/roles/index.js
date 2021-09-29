const searchUsersWithRoleAndMarkAsReloadPermissions = require('./searchUsersWithRoleAndMarkAsReloadPermissions');
const { removePermissionAll } = require('./removePermissionAll');
const { addPermissionMany } = require('./addPermissionMany');
const { update } = require('./update');
const { add } = require('./add');
const { detail } = require('./detail');
const { listForCenter } = require('./listForCenter');
const removePermissionsByName = require('./removePermissionsByName');
const { getRoleProfile } = require('./getRoleProfile');

module.exports = {
  add,
  update,

  detail,
  listForCenter,

  addPermissionMany,
  deletePermissionAll: removePermissionAll,
  removePermissionsByName: removePermissionsByName,
  searchUsersWithRoleAndMarkAsReloadPermissions,
  getRoleProfile,
};
