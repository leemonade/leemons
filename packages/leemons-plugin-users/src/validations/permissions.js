const { LeemonsValidator } = global.utils;
const { stringSchema, arrayStringRequiredSchema } = require('./types');

const userAddCustomPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: stringSchema,
    actionNames: arrayStringRequiredSchema,
    target: stringSchema,
    center: stringSchema,
  },
  required: ['permissionName', 'actionNames'],
  additionalProperties: false,
};

const userRemoveCustomPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: stringSchema,
    actionNames: arrayStringRequiredSchema,
    target: stringSchema,
  },
  required: ['permissionName'],
  additionalProperties: false,
};

function validateUserAddCustomPermission(data) {
  const validator = new LeemonsValidator(userAddCustomPermissionSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateUserRemoveCustomPermission(data) {
  const validator = new LeemonsValidator(userRemoveCustomPermissionSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateUserAddCustomPermission,
  validateUserRemoveCustomPermission,
};
