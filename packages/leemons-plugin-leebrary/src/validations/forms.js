const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
} = require('./types');

const addAssetSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    color: stringSchemaNullable,
    description: textSchemaNullable,
    categoryId: stringSchema,
    categoryKey: stringSchema,
    category: {
      oneOf: [stringSchemaNullable, { type: 'object', nullable: true }],
    },
  },
  required: ['name'],
  anyOf: [{ required: ['categoryId'] }, { required: ['categoryKey'] }, { required: ['category'] }],
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
    isPublic: booleanSchema,
    canAccess: {
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
  required: ['asset'],
  anyOf: [{ required: ['canAccess'] }, { required: ['isPublic'] }],
  additionalProperties: true,
};

async function validateSetPermissions(data) {
  const validator = new LeemonsValidator(setPermissionsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addBookmarkSchema = {
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
  const validator = new LeemonsValidator(addBookmarkSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddAsset,
  validateSetPermissions,
  validateAddBookmark,
};
