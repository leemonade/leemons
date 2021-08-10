const getSchema = require('./getSchema');
const addSchema = require('./addSchema');
const updateSchema = require('./updateSchema');
const deleteSchema = require('./deleteSchema');
const existSchema = require('./existSchema');
const getSchemaWithLocale = require('./getSchemaWithLocale');
const { transformJsonSchema, transformUiSchema } = require('./transformJsonOrUiSchema');
const saveField = require('./saveField');

module.exports = {
  getSchema,
  addSchema,
  updateSchema,
  deleteSchema,
  existSchema,
  getSchemaWithLocale,
  transformJsonSchema,
  transformUiSchema,
  saveField,
};
