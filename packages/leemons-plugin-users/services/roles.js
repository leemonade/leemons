const roles = require('../src/services/roles');
const _ = require('lodash');
const { validatePermissionName } = require('../src/validations/exists');

function addPermissionMany(roleId, permissions, { isCustom, transacting } = {}) {
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission.permissionName, this.calledFrom);
  });
  return roles.addPermissionMany(roleId, permissions, { isCustom, transacting });
}

module.exports = {
  add: roles.add,
  update: roles.update,
  addPermissionMany,
  removePermissionsByName: roles.removePermissionsByName,
  getRoleProfile: roles.getRoleProfile,
};
