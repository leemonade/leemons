const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { ajvSchema, stringSchema, localeSchema } = require('./types');

const addSchemaLocaleSchema = {
  type: 'object',
  properties: {
    schemaData: ajvSchema,
    uiData: ajvSchema,
    locationName: stringSchema,
    pluginName: stringSchema,
    locale: localeSchema,
  },
  required: ['schemaData', 'uiData', 'locationName', 'pluginName', 'locale'],
};

const existSchemaLocaleSchema = {
  type: 'object',
  properties: {
    key: {
      enum: ['jsonSchema', 'jsonUI'],
    },
    locationName: stringSchema,
    pluginName: stringSchema,
    locale: localeSchema,
  },
  required: ['key', 'locationName', 'pluginName', 'locale'],
};

function validateAddSchemaLocale(data) {
  const validator = new LeemonsValidator(addSchemaLocaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateExistSchemaLocaleData(data) {
  const validator = new LeemonsValidator(existSchemaLocaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddSchemaLocale,
  validateExistSchemaLocaleData,
};
