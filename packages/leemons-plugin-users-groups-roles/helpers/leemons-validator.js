const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class LeemonsValidator {
  constructor(schema) {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    this.schema = schema;
  }

  validate(data) {}
}

module.exports = LeemonsValidator;
