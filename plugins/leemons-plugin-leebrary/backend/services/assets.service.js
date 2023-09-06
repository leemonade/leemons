/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/assets.rest');
const { getByIds } = require('../core/assets/getByIds');

/** @type {ServiceSchema} */
module.exports = {
  name: 'leebrary.assets',
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
    add: {
      handler() {
        return { id: 'test' };
      },
    },
    update: {
      handler() {
        return { id: 'test' };
      },
    },
    getByIds: {
      handler(ctx) {
        return getByIds({ ...ctx.params, ctx });
      },
    },
    getCoverUrl: {
      handler(ctx) {
        // TODO: Esto deberia de hacerse en un paquete de leebrary para gastar menos recursos
        return `/api/leebrary/img/${ctx.params.assetId}`;
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
