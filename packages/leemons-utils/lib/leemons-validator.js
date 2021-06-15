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
    return _.map(_.uniqBy(this.validate.errors, 'message'), 'message').join('\n');
  }
}

module.exports = LeemonsValidator;
