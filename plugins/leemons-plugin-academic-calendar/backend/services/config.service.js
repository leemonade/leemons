/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/config.rest');
const { getConfig } = require('../core/config');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-calendar.config',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    getConfig: {
      handler(ctx) {
        return getConfig({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
