/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/config.rest');
const { pluginName } = require('../config/constants');
const { removeConfig, setConfig } = require('../core/provider');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.config`,
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    removeConfig: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return removeConfig(payload);
      },
    },
    setConfig: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.config = payload.config ?? payload.newConfig;
        return setConfig(payload);
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
