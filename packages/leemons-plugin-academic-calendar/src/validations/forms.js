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
      additionalProperties: false,
    },
    allCoursesHaveSameDays: booleanSchemaNullable,
    courseDays: {
      type: 'object',
      additionalProperties: false,
    },
    allCoursesHaveSameHours: booleanSchemaNullable,
    allDaysHaveSameHours: booleanSchemaNullable,
    courseHours: {
      type: 'object',
      additionalProperties: false,
    },
    breaks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
      },
      nullable: true,
    },
  },
  required: ['program', 'courseDates', 'courseDays', 'courseHours'],
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
