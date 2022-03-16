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
    categoryId: stringSchema
  },
  required: [ 'name', 'categoryId' ],
  additionalProperties: true,
};

function validateAddAsset(data) {
  let validator = new LeemonsValidator(addAssetSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddAsset,
};
