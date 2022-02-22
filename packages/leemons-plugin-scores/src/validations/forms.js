const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { table } = require('../services/tables');
const { stringSchema, numberSchema, stringSchemaNullable } = require('./types');

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
