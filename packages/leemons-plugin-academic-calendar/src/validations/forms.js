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
} = require('./types');

const saveConfigSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    allCoursesHaveSameConfig: booleanSchemaNullable,
    allCoursesHaveSameDates: booleanSchemaNullable,
    courseDates: {
      type: 'object',
      additionalProperties: true,
    },
    allCoursesHaveSameDays: booleanSchemaNullable,
    courseDays: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    allCoursesHaveSameHours: booleanSchemaNullable,
    allDaysHaveSameHours: booleanSchemaNullable,
    courseHours: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
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

module.exports = {
  validateSaveConfig,
};
