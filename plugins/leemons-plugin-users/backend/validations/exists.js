const { exist: existItemPermission } = require('../core/item-permissions/exist');
const { exist: existPermission } = require('../core/permissions/exist');

async function validateExistPermission({ permissionName, ctx }) {
  if (await existPermission({ permissionName, ctx }))
    throw new Error(`Permission '${permissionName}' already exists`);
}

async function validateNotExistPermission({ permissionName, ctx }) {
  if (!(await existPermission({ permissionName, ctx })))
    throw new Error(`Permission '${permissionName}' not exists`);
}

async function validateExistItemPermissions({ query, ctx }) {
  if (await existItemPermission({ query, ctx }))
    throw new Error(`An item with these permissions already exists`);
}

async function validateNotExistItemPermissions({ query, ctx }) {
  if (!(await existItemPermission({ query, ctx })))
    throw new Error(`There is no item with these permissions`);
}

function validateTypePrefix(type, calledFrom) {
  if (!type.startsWith(calledFrom))
    throw new Error(`The type name (${type}) must begin with ${calledFrom}`);
}

function validatePermissionName(permissionName, calledFrom) {
  if (!permissionName.startsWith(calledFrom))
    throw new Error(`The permission name (${permissionName}) must begin with ${calledFrom}`);
}

function validateRoleType(permissionName, calledFrom) {
  if (!permissionName.startsWith(calledFrom))
    throw new Error(`The role type (${permissionName}) must begin with ${calledFrom} `);
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
