const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  dateSchema,
  booleanSchema,
  integerSchema,
  localeObjectSchema,
} = require('./types');

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

const updateEventSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    isAllDay: booleanSchema,
    repeat: stringSchema,
    data: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: false,
};

function validateUpdateEvent(data) {
  const validator = new LeemonsValidator(updateEventSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addKanbanColumnSchema = () => ({
  type: 'object',
  properties: {
    name: localeObjectSchema(),
    order: integerSchema,
    isDone: booleanSchema,
    isArchived: booleanSchema,
    bgColor: stringSchema,
  },
  required: [],
  additionalProperties: false,
});

function validateAddKanbanColumn(data) {
  const validator = new LeemonsValidator(addKanbanColumnSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddEvent,
  validateUpdateEvent,
  validateAddCalendar,
  validateAddKanbanColumn,
};
