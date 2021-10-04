const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  dateSchema,
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
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

const addCalendarConfigSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    description: stringSchema,
    addedFrom: stringSchema,
    countryName: stringSchema,
    countryShortCode: stringSchema,
    regionShortCode: stringSchema,
    regionName: stringSchema,
    startMonth: integerSchema,
    startYear: integerSchema,
    endMonth: integerSchema,
    endYear: integerSchema,
    weekday: integerSchema,
    notSchoolDays: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    schoolDays: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    centers: arrayStringSchema,
  },
  required: [
    'title',
    'addedFrom',
    'countryName',
    'countryShortCode',
    'regionShortCode',
    'regionName',
    'startMonth',
    'startYear',
    'endMonth',
    'endYear',
    'weekday',
    'notSchoolDays',
    'schoolDays',
  ],
  additionalProperties: false,
};

function validateAddCalendarConfig(data) {
  const validator = new LeemonsValidator(addCalendarConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addCalendarGroupsSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    center: stringSchema,
    calendars: {
      type: 'array',
      items: {
        ...addCalendarSchema,
        properties: {
          ...addCalendarSchema.properties,
          events: {
            type: 'array',
            items: addEventSchema,
          },
        },
      },
    },
  },
  required: ['title'],
  additionalProperties: false,
};

function validateAddCalendarGroups(data) {
  const validator = new LeemonsValidator(addCalendarGroupsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddEvent,
  validateUpdateEvent,
  validateAddCalendar,
  validateAddKanbanColumn,
  validateAddCalendarConfig,
  validateAddCalendarGroups,
};
