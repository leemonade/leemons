/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const locale = require('../core/locale');

const restActions = require('./rest/locales.rest');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.locales',
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
    add: {
      handler(ctx) {
        return locale.add({ ...ctx.params, ctx });
      },
    },
    addMany: {
      handler(ctx) {
        return locale.addMany({ ...ctx.params, ctx });
      },
    },
    delete: {
      handler(ctx) {
        return locale.delete({ ...ctx.params, ctx });
      },
    },
    deleteMany: {
      handler(ctx) {
        return locale.deleteMany({ ...ctx.params, ctx });
      },
    },
    has: {
      handler(ctx) {
        return locale.has({ ...ctx.params, ctx });
      },
    },
    hasMany: {
      handler(ctx) {
        return locale.hasMany({ ...ctx.params, ctx });
      },
    },
    get: {
      handler(ctx) {
        return locale.get({ ...ctx.params, ctx });
      },
    },
    getMany: {
      handler(ctx) {
        return locale.getMany({ ...ctx.params, ctx });
      },
    },
    getAll: {
      handler(ctx) {
        return locale.getAll({ ...ctx.params, ctx });
      },
    },
    setName: {
      handler(ctx) {
        return locale.setName({ ...ctx.params, ctx });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
