const exist = require('../services/item-permissions/exist');

async function validateExistItemPermissions(data, { transacting } = {}) {
  if (await exist(data, { transacting }))
    throw new Error(`An item with these permissions already exists`);
}

async function validateNotExistItemPermissions(data, { transacting } = {}) {
  if (!(await exist(data, { transacting })))
    throw new Error(`There is no item with these permissions`);
}

function validateTypePrefix(type, calledFrom) {
  if (!type.startsWith(calledFrom)) throw new Error(`The type name must begin with ${calledFrom}`);
}

function validatePermissionName(type, calledFrom) {
  if (!type.startsWith(calledFrom))
    throw new Error(`The permission name must begin with ${calledFrom}`);
}

module.exports = {
  validateExistItemPermissions,
  validateNotExistItemPermissions,
  validatePermissionName,
  validateTypePrefix,
};
