const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { localeSchema, localeObjectSchema, stringSchema } = require('./types');

const addLocationSchema = () => ({
  type: 'object',
  properties: {
    name: localeObjectSchema(),
    description: localeObjectSchema(),
    locationName: stringSchema,
    pluginName: stringSchema,
  },
  required: ['name', 'locationName', 'pluginName'],
});

const locationPluginSchema = {
  type: 'object',
  properties: {
    locationName: stringSchema,
    pluginName: stringSchema,
  },
  required: ['locationName', 'pluginName'],
};

const locationPluginLocaleSchema = {
  type: 'object',
  properties: {
    locationName: stringSchema,
    pluginName: stringSchema,
    locale: localeSchema,
  },
  required: ['locationName', 'pluginName'],
};

function validateAddLocation(data) {
  const validator = new LeemonsValidator(addLocationSchema());

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateLocationAndPlugin(locationName, pluginName) {
  const validator = new LeemonsValidator(locationPluginSchema);
  if (!validator.validate({ locationName, pluginName })) {
    throw validator.error;
  }
}

function validateLocationAndPluginAndLocale(locationName, pluginName, locale, localeRequired) {
  const schema = _.cloneDeep(locationPluginLocaleSchema);
  if (localeRequired) {
    schema.required.push('locale');
  }
  const validator = new LeemonsValidator(schema);
  if (!validator.validate({ locationName, pluginName, locale })) {
    throw validator.error;
  }
}

module.exports = {
  validateAddLocation,
  validateLocationAndPlugin,
  validateLocationAndPluginAndLocale,
};
