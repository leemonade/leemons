const { LeemonsValidator } = global.utils;
const { stringSchema, integerSchema, integerSchemaNullable } = require('./types');

const updateProgramSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: {
      type: 'string',
      minLength: 1,
      maxLength: 8,
    },
    credits: integerSchemaNullable,
    treeType: integerSchema,
  },
  required: ['id'],
  additionalProperties: false,
};

function validateUpdateProgram(data) {
  const validator = new LeemonsValidator(updateProgramSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateUpdateProgram,
};
