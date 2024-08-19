/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const {
  getSchema,
  addSchema,
  updateSchema,
  deleteSchema,
  existSchema,
  getSchemaWithLocale,
  transformJsonSchema,
  transformUiSchema,
} = require('../core/datasetSchema');
const {
  getSchemaLocale,
  addSchemaLocale,
  updateSchemaLocale,
  deleteSchemaLocale,
  existSchemaLocale,
} = require('../core/datasetSchemaLocale');
const {
  validateDataForJsonSchema,
  existValues,
  deleteValues,
  updateValues,
  addValues,
  getValues,
  setValues,
} = require('../core/datasetValues');
const {
  getLocation,
  updateLocation,
  deleteLocation,
  existLocation,
} = require('../core/datesetLocation');
const addLocation = require('../core/datesetLocation/addLocation');
const { getServiceModels } = require('../models');

const restActions = require('./rest/dataset.rest');
/** @type {ServiceSchema} */
module.exports = {
  name: 'dataset.dataset',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    // LOCATION
    getLocation: {
      handler(ctx) {
        return getLocation({ ...ctx.params, ctx });
      },
    },
    addLocation: {
      handler(ctx) {
        return addLocation({ ...ctx.params, ctx });
      },
    },
    updateLocation: {
      handler(ctx) {
        return updateLocation({ ...ctx.params, ctx });
      },
    },
    deleteLocation: {
      handler(ctx) {
        return deleteLocation({ ...ctx.params, ctx });
      },
    },
    existLocation: {
      handler(ctx) {
        return existLocation({ ...ctx.params, ctx });
      },
    },

    // SCHEMA
    getSchema: {
      handler(ctx) {
        return getSchema({ ...ctx.params, ctx });
      },
    },
    addSchema: {
      handler(ctx) {
        return addSchema({ ...ctx.params, ctx });
      },
    },
    updateSchema: {
      handler(ctx) {
        return updateSchema({ ...ctx.params, ctx });
      },
    },
    deleteSchema: {
      handler(ctx) {
        return deleteSchema({ ...ctx.params, ctx });
      },
    },
    existSchema: {
      handler(ctx) {
        return existSchema({ ...ctx.params, ctx });
      },
    },
    getSchemaWithLocale: {
      handler(ctx) {
        return getSchemaWithLocale({ ...ctx.params, ctx });
      },
    },
    transformJsonSchema: {
      handler(ctx) {
        return transformJsonSchema({ ...ctx.params, ctx });
      },
    },
    transformUiSchema: {
      handler(ctx) {
        return transformUiSchema({ ...ctx.params, ctx });
      },
    },

    // LOCALE
    getSchemaLocale: {
      handler(ctx) {
        return getSchemaLocale({ ...ctx.params, ctx });
      },
    },
    addSchemaLocale: {
      handler(ctx) {
        return addSchemaLocale({ ...ctx.params, ctx });
      },
    },
    updateSchemaLocale: {
      handler(ctx) {
        return updateSchemaLocale({ ...ctx.params, ctx });
      },
    },
    deleteSchemaLocale: {
      handler(ctx) {
        return deleteSchemaLocale({ ...ctx.params, ctx });
      },
    },
    existSchemaLocale: {
      handler(ctx) {
        return existSchemaLocale({ ...ctx.params, ctx });
      },
    },

    // VALUES
    setValues: {
      handler(ctx) {
        return setValues({ ...ctx.params, ctx });
      },
    },
    getValues: {
      handler(ctx) {
        return getValues({ ...ctx.params, ctx });
      },
    },
    addValues: {
      handler(ctx) {
        return addValues({ ...ctx.params, ctx });
      },
    },
    updateValues: {
      handler(ctx) {
        return updateValues({ ...ctx.params, ctx });
      },
    },
    deleteValues: {
      handler(ctx) {
        return deleteValues({ ...ctx.params, ctx });
      },
    },
    existValues: {
      handler(ctx) {
        return existValues({ ...ctx.params, ctx });
      },
    },
    validateDataForJsonSchema: {
      handler(ctx) {
        return validateDataForJsonSchema({ ...ctx.params, ctx });
      },
    },
  },
};
