/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { add, exist, remove, getIfHasPermission } = require('../core/menu');
const restActions = require('./rest/menu.rest');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'menu-builder.menu',
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
      handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    exist: {
      handler(ctx) {
        return exist({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    getIfHasPermission: {
      handler(ctx) {
        return getIfHasPermission({ ...ctx.params, ctx });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
