const { LeemonsValidator, validateSchema } = require('leemons-validator');

const userAddCustomPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: validateSchema.string,
    actionNames: validateSchema.arrayStringRequired,
    target: validateSchema.string,
    center: validateSchema.string,
  },
  required: ['permissionName', 'actionNames'],
  additionalProperties: false,
};

const userRemoveCustomPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: validateSchema.string,
    actionNames: validateSchema.arrayStringRequired,
    target: validateSchema.string,
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
