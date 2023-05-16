const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  dateSchema,
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  localeObjectSchema,
  dateSchemaNullable,
} = require('./types');

const addCalendarSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    icon: stringSchema,
    bgColor: stringSchema,
    borderColor: stringSchema,
    section: stringSchema,
    metadata: {
      type: 'object',
      additionalProperties: true,
    },
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
    startDate: dateSchemaNullable,
    endDate: dateSchemaNullable,
    isAllDay: booleanSchema,
    isPrivate: booleanSchema,
    repeat: stringSchema,
    type: stringSchema,
    users: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
    },
    data: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['title', 'type'], // 'startDate', 'endDate',
  additionalProperties: false,
};

function validateAddEvent(data) {
  const schema = _.cloneDeep(addEventSchema);

  if (data.type !== 'plugins.calendar.task') {
    schema.required.push('startDate', 'endDate');
  }

  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const updateEventSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    startDate: dateSchemaNullable,
    endDate: dateSchemaNullable,
    isAllDay: booleanSchema,
    isPrivate: {
      type: ['boolean', 'number'],
      nullable: true,
    },
    repeat: stringSchema,
    type: stringSchema,
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

const addClassroomLevelSchema = {
  type: 'object',
  properties: {
    level: stringSchema,
  },
  required: ['level'],
  additionalProperties: false,
};

function validateAddClassroomLevel(data) {
  const validator = new LeemonsValidator(addClassroomLevelSchema);

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
  validateAddClassroomLevel,
};
