const { LeemonsValidator } = global.utils;
const { stringSchema, arrayStringRequiredSchema } = require('./types');

const addStatementSchema = {
  type: 'object',
  properties: {
    actor: {
      oneOf: [stringSchema, arrayStringRequiredSchema],
    },
    verb: {
      type: 'object',
      additionalProperties: true,
    },
    object: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['actor', 'verb', 'object'],
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
