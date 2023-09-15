const { localeRegexString } = require('@leemons/validator');

const textSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 65000,
};

const textSchemaNullable = {
  type: 'string',
  minLength: 0,
  maxLength: 65000,
  nullable: true,
};

const numberSchema = {
  type: 'number',
};

const stringSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
};

const stringSchemaNullable = {
  type: 'string',
  minLength: 0,
  maxLength: 255,
  nullable: true,
};

const arrayStringSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
};

const arrayStringRequiredSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
  minItems: 1,
};

const dateSchema = {
  type: 'string',
  format: 'date-time',
};

const booleanSchema = {
  type: 'boolean',
};

const integerSchema = {
  type: 'integer',
};

const integerSchemaNullable = {
  type: 'integer',
  nullable: true,
};

const localeObjectSchema = () => ({
  type: 'object',
  patternProperties: {
    [localeRegexString]: {
      type: 'string',
    },
  },
});

module.exports = {
  dateSchema,
  textSchema,
  numberSchema,
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  textSchemaNullable,
  localeObjectSchema,
  stringSchemaNullable,
  integerSchemaNullable,
  arrayStringRequiredSchema,
};
