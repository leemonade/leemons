const { localeRegexString } = require('@leemons/validator');

/**
 * String with format localeCode (xx or xx-yy)
 */
const localeSchema = {
  type: 'string',
  format: 'localeCode',
  minLength: 2,
  maxLength: 12,
};

const localeObjectSchema = () => ({
  type: 'object',
  patternProperties: {
    [localeRegexString]: {
      type: 'string',
    },
  },
});

const textSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 65535,
};

const stringSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
};

const ajvSchema = {
  type: 'object',
  properties: {},
  additionalProperties: true,
};

module.exports = {
  localeSchema,
  textSchema,
  stringSchema,
  ajvSchema,
  localeObjectSchema,
};
