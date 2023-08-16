const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  dateSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
  textSchema,
} = require('./types');

const saveSessionSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    class: stringSchema,
    start: dateSchema,
    end: dateSchema,
    attendance: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    comments: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
  },
  required: ['class', 'start', 'end'],
  additionalProperties: false,
};

function validateSaveSession(data) {
  const schema = _.cloneDeep(saveSessionSchema);
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveSession,
};
