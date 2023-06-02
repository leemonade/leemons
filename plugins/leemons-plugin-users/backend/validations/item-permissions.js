const { LeemonsValidator, validateSchema } = require('leemons-validator');

const itemPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: validateSchema.text,
    actionNames: validateSchema.arrayStringRequired,
    target: validateSchema.string,
    type: validateSchema.string,
    item: validateSchema.string,
    center: validateSchema.text,
  },
  required: ['permissionName', 'actionNames', 'type', 'item'],
  additionalProperties: false,
};

const findItemPermissionSchema = {
  type: 'object',
  properties: {
    permissionName: validateSchema.text,
    actionNames: validateSchema.arrayStringRequired,
    target: validateSchema.string,
    type: validateSchema.string,
    center: validateSchema.text,
  },
  required: ['permissionName', 'actionNames', 'type'],
  additionalProperties: false,
};

function validateItemPermission(data) {
  const validator = new LeemonsValidator(itemPermissionSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateFindItemPermission(data) {
  const validator = new LeemonsValidator(findItemPermissionSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const saveSystemDataFieldsConfigSchema = {
  type: 'object',
  properties: {
    secondSurname: {
      type: 'object',
      properties: {
        required: { type: 'boolean' },
        disabled: { type: 'boolean' },
      },
      required: ['required', 'disabled'],
      additionalProperties: false,
    },
    avatar: {
      type: 'object',
      properties: {
        required: { type: 'boolean' },
        disabled: { type: 'boolean' },
      },
      required: ['required', 'disabled'],
      additionalProperties: false,
    },
  },
  required: ['secondSurname', 'avatar'],
  additionalProperties: false,
};

function validateSaveSystemDataFieldsConfig(data) {
  const validator = new LeemonsValidator(saveSystemDataFieldsConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateItemPermission,
  validateFindItemPermission,
  validateSaveSystemDataFieldsConfig,
};
