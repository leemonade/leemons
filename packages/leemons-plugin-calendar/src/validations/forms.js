const { LeemonsValidator } = global.utils;
const { stringSchema, dateSchema, booleanSchema } = require('./types');

const addCalendarSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    icon: stringSchema,
    bgColor: stringSchema,
    borderColor: stringSchema,
    section: stringSchema,
  },
  required: ['name', 'bgColor', 'section'],
  additionalProperties: false,
};

function validateAddCalendar(data) {
  const validator = new LeemonsValidator(addCalendarSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

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
  validateAddCalendar,
};
