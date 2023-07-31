const { LeemonsValidator } = require('leemons-validator');
const { ajvSchema, stringSchema } = require('./types');

const addSchemaSchema = {
  type: 'object',
  properties: {
    jsonUI: ajvSchema,
    jsonSchema: ajvSchema,
    locationName: stringSchema,
    pluginName: stringSchema,
  },
  required: ['jsonUI', 'jsonSchema', 'locationName', 'pluginName'],
};

function validateAddSchema(data) {
  const validator = new LeemonsValidator(addSchemaSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddSchema,
};
