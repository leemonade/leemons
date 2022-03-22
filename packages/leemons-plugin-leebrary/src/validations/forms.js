const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  integerSchemaNullable,
  stringSchemaNullable,
  numberSchema,
} = require('./types');

const addAssetSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    tags: arrayStringSchema,
    color: stringSchemaNullable,
    description: stringSchemaNullable,
    categoryId: stringSchema,
  },
  required: ['name', 'categoryId'],
  additionalProperties: true,
};

async function validateAddAsset(data) {
  const validator = new LeemonsValidator(addAssetSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const setPermissionsSchema = {
  type: 'object',
  properties: {
    asset: stringSchema,
    userAgentsAndRoles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userAgent: stringSchema,
          role: stringSchema,
        },
        required: ['userAgent', 'role'],
      },
    },
  },
  required: ['asset', 'userAgentsAndRoles'],
  additionalProperties: true,
};

async function validateSetPermissions(data) {
  const validator = new LeemonsValidator(setPermissionsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddAsset,
  validateSetPermissions,
};
