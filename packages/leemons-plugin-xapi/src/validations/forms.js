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

const addStatementSchema = {
  type: 'object',
  properties: {
    user: stringSchema,
    verb: stringSchema,
    object: stringSchema,
    type: stringSchema,
  },
  required: ['user', 'verb', 'object'],
  additionalProperties: true,
};

async function validateAddStatement(data) {
  const validator = new LeemonsValidator(addStatementSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddStatement,
};
