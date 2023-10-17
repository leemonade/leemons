const { LeemonsValidator } = require('@leemons/validator');
const { stringSchema } = require('./types');

const addProgramConfigSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
  },
  required: ['name'],
  additionalProperties: false,
};

function validateAddProgramConfig(data) {
  const validator = new LeemonsValidator(addProgramConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddProgramConfig,
};
