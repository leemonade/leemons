const { exist: existItemPermission } = require('../services/item-permissions/exist');
const { exist: existPermission } = require('../services/permissions/exist');

async function validateExistPermission(permissionName, { transacting } = {}) {
  if (await existPermission(permissionName, { transacting }))
    throw new Error(`Permission '${permissionName}' already exists`);
}

async function validateNotExistPermission(permissionName, { transacting } = {}) {
  if (!(await existPermission(permissionName, { transacting })))
    throw new Error(`Permission '${permissionName}' not exists`);
}

async function validateExistItemPermissions(data, { transacting } = {}) {
  if (await existItemPermission(data, { transacting }))
    throw new Error(`An item with these permissions already exists`);
}

async function validateNotExistItemPermissions(data, { transacting } = {}) {
  if (!(await existItemPermission(data, { transacting })))
    throw new Error(`There is no item with these permissions`);
}

function validateTypePrefix(type, calledFrom) {
  if (!type.startsWith(calledFrom)) throw new Error(`The type name must begin with ${calledFrom}`);
}

function validatePermissionName(permissionName, calledFrom) {
  if (!permissionName.startsWith(calledFrom))
    throw new Error(`The permission name must begin with ${calledFrom}`);
}

function validateRoleType(permissionName, calledFrom) {
  if (!permissionName.startsWith(calledFrom))
    throw new Error(`The role type must begin with ${calledFrom}`);
}

module.exports = {
  validateExistItemPermissions,
  validateNotExistItemPermissions,
  validatePermissionName,
  validateTypePrefix,
  validateExistPermission,
  validateNotExistPermission,
  validateRoleType,
};
