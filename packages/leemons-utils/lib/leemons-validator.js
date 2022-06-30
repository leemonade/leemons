const _ = require('lodash');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addKeywords = require('ajv-keywords');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addKeywords(ajv);

class LeemonsValidator {
  constructor(schema, options) {
    if (options) {
      const aj = new Ajv({ ...options, allErrors: true });
      addFormats(aj);
      this.validate = aj.compile(schema);
    } else {
      this.validate = ajv.compile(schema);
    }

    this.schema = schema;
  }

  get error() {
    return new Error(this.errorMessage);
  }

  get errorMessage() {
    return _.map(
      _.uniqBy(this.validate.errors, 'message'),
      (error) => `"${error.instancePath}": ${error.message}`
    ).join('\n');
  }

  get ajvError() {
    return this.validate.errors;
  }
}

LeemonsValidator.ajv = ajv;

module.exports = LeemonsValidator;
