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
    color: stringSchemaNullable,
    description: stringSchemaNullable,
    categoryId: stringSchema,
    categoryKey: stringSchema,
  },
  required: ['name'],
  anyOf: [{ required: ['categoryId'] }, { required: ['categoryKey'] }],
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

const addBookmarSchema = {
  type: 'object',
  properties: {
    url: stringSchema,
    iconUrl: stringSchemaNullable,
    assetId: stringSchema,
  },
  required: ['url', 'assetId'],
  additionalProperties: true,
};

async function validateAddBookmark(data) {
  const validator = new LeemonsValidator(addBookmarSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddAsset,
  validateSetPermissions,
  validateAddBookmark,
};
