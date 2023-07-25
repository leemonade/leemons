/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');
const restActions = require('./config.rest');

const configService = require('../core/config');

/** @type {ServiceSchema} */
module.exports = {
  name: 'emails.config',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    getConfig: {
      handler(ctx) {
        return configService.getConfig({ ...ctx.params, ctx });
      },
    },
    getUserAgentsWithKeyValue: {
      handler(ctx) {
        return configService.getUserAgentsWithKeyValue({ ...ctx.params, ctx });
      },
    },
    getValuesForUserAgentsAndKey: {
      handler(ctx) {
        return configService.getValuesForUserAgentsAndKey({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
