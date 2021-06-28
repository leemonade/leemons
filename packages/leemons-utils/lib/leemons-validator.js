const _ = require('lodash');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

class LeemonsValidator {
  constructor(schema) {
    this.validate = ajv.compile(schema);
    this.schema = schema;
  }

  get error() {
    return new Error(this.errorMessage);
  }

  get errorMessage() {
    return _.map(_.uniqBy(this.validate.errors, 'message'), (error) => {
      return `"${error.instancePath}": ${error.message}`;
    }).join('\n');
  }
}

LeemonsValidator.ajv = ajv;

module.exports = LeemonsValidator;
