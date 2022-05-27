const { translations } = require('../translations');

const textSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 65000,
};

const stringSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
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

const dateSchemaNullable = {
  type: 'string',
  format: 'date-time',
  nullable: true,
};

const booleanSchema = {
  type: 'boolean',
};

const integerSchema = {
  type: 'integer',
};

const localeObjectSchema = () => ({
  type: 'object',
  patternProperties: {
    [translations().functions.localeRegexString]: {
      type: 'string',
    },
  },
});

module.exports = {
  dateSchema,
  textSchema,
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  dateSchemaNullable,
  localeObjectSchema,
  arrayStringRequiredSchema,
};
