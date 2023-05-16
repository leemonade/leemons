const {
  getLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  existLocation,
} = require('../src/services/dataset-location');

const {
  getSchema,
  addSchema,
  updateSchema,
  deleteSchema,
  existSchema,
  getSchemaWithLocale,
  transformJsonSchema,
  transformUiSchema,
} = require('../src/services/dataset-schema');

const {
  getSchemaLocale,
  addSchemaLocale,
  updateSchemaLocale,
  deleteSchemaLocale,
  existSchemaLocale,
} = require('../src/services/dataset-schema-locale');

const {
  setValues,
  getValues,
  addValues,
  updateValues,
  deleteValues,
  existValues,
  validateDataForJsonSchema,
} = require('../src/services/dataset-values');

module.exports = {
  getLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  existLocation,

  getSchema,
  addSchema,
  updateSchema,
  deleteSchema,
  existSchema,
  getSchemaWithLocale,
  transformJsonSchema,
  transformUiSchema,

  getSchemaLocale,
  addSchemaLocale,
  updateSchemaLocale,
  deleteSchemaLocale,
  existSchemaLocale,

  setValues,
  getValues,
  addValues,
  updateValues,
  deleteValues,
  existValues,
  validateDataForJsonSchema,
};
