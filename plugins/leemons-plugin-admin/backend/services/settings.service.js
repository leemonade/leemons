/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/settings.rest');
const settingsService = require('../core/settings');

/** @type {ServiceSchema} */
module.exports = {
  name: 'admin.settings',
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
    findOne: {
      handler(ctx) {
        return settingsService.findOne({ ctx });
      },
    },
    update: {
      handler(ctx) {
        return settingsService.update({ ...ctx.params, ctx });
      },
    },
    registerAdmin: {
      handler(ctx) {
        return settingsService.registerAdmin({ ...ctx.params, ctx });
      },
    },
    setLanguages: {
      handler(ctx) {
        return settingsService.setLanguages({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
