const { LeemonsValidator } = global.utils;
const { stringSchema, dateSchema, booleanSchema } = require('./types');

const addEventSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    isAllDay: booleanSchema,
    repeat: stringSchema,
    type: stringSchema,
    data: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['title', 'startDate', 'endDate', 'type'],
  additionalProperties: false,
};

function validateAddEvent(data) {
  const validator = new LeemonsValidator(addEventSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddEvent,
};
