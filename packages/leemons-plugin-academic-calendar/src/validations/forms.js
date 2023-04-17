const { LeemonsValidator } = global.utils;
const _ = require('lodash');
const {
  stringSchema,
  booleanSchema,
  integerSchema,
  booleanSchemaNullable,
  arrayStringSchema,
  integerSchemaNullable,
  stringSchemaNullable,
  numberSchema,
  dateSchema,
} = require('./types');

const saveConfigSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    regionalConfig: stringSchemaNullable,
    allCoursesHaveSameConfig: booleanSchemaNullable,
    allCoursesHaveSameDates: booleanSchemaNullable,
    courseDates: {
      type: 'object',
      additionalProperties: true,
    },
    substagesDates: {
      type: 'object',
      additionalProperties: true,
    },
    courseEvents: {
      type: 'object',
      additionalProperties: true,
    },
    allCoursesHaveSameDays: booleanSchemaNullable,
    breaks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
      },
      nullable: true,
    },
  },
  required: ['program', 'courseDates'],
  additionalProperties: false,
};

function validateSaveConfig(data) {
  const validator = new LeemonsValidator(saveConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const events = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: stringSchema,
      startDate: dateSchema,
      endDate: dateSchema,
    },
    required: ['name', 'startDate', 'endDate'],
  },
};

const saveRegionalConfigSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    center: stringSchema,
    regionalEventsRel: stringSchemaNullable,
    regionalEvents: events,
    localEvents: events,
    daysOffEvents: events,
  },
  required: ['name', 'center'],
  additionalProperties: false,
};

function validateSaveRegionalConfig(data) {
  const validator = new LeemonsValidator(saveRegionalConfigSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveConfig,
  validateSaveRegionalConfig,
};
