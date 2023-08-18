const { add } = require('./add');
const { update } = require('./update');
const { detail } = require('./detail');
const { getRoleProfile } = require('./getRoleProfile');
const { getRolesProfiles } = require('./getRolesProfiles');
const { addPermissionMany } = require('./addPermissionMany');
const { removePermissionAll } = require('./permissions/removePermissionAll');
const { removePermissionsByName } = require('./permissions/removePermissionsByName');
const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('./searchUsersWithRoleAndMarkAsReloadPermissions');

module.exports = {
  add,
  update,
  detail,
  getRoleProfile,
  getRolesProfiles,
  addPermissionMany,
  deletePermissionAll: removePermissionAll,
  removePermissionsByName,
  searchUsersWithRoleAndMarkAsReloadPermissions,
};
