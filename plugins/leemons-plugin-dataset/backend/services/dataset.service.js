/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocation } = require('../core/datesetLocation/addLocation');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'dataset.dataset',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    // LOCATION
    // getLocation,
    // addLocation,
    addLocation: {
      handler(ctx) {
        return addLocation({ ctx });
      },
    },
    // updateLocation,
    // deleteLocation,
    // existLocation,
    // SCHEMA
    // getSchema,
    // addSchema,
    // updateSchema,
    // deleteSchema,
    // existSchema,
    // getSchemaWithLocale,
    // transformJsonSchema,
    // transformUiSchema,
    // LOCALE
    // getSchemaLocale,
    // addSchemaLocale,
    // updateSchemaLocale,
    // deleteSchemaLocale,
    // existSchemaLocale,
    // VALUES
    // setValues,
    // getValues,
    // addValues,
    // updateValues,
    // deleteValues,
    // existValues,
    // validateDataForJsonSchema,
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
