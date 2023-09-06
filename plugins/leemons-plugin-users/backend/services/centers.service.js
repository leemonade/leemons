/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const { add, list, detail, existName } = require('../core/centers');
const restActions = require('./rest/centers.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.centers',
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
      async handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    list: {
      async handler(ctx) {
        return list({ ...ctx.params, ctx });
      },
    },
    detail: {
      async handler(ctx) {
        return detail({ ...ctx.params, ctx });
      },
    },
    existName: {
      async handler(ctx) {
        return existName({ ...ctx.params, ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
