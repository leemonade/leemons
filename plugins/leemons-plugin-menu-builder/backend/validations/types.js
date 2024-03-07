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

const numberSchema = {
  type: 'number',
};

const booleanSchema = {
  type: 'boolean',
};

module.exports = {
  localeSchema,
  textSchema,
  stringSchema,
  numberSchema,
  booleanSchema,
  localeObjectSchema,
};
