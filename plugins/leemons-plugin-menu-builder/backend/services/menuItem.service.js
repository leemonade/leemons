/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const { getServiceModels } = require('../models');
const {
  add,
  exist,
  remove,
  update,
  enable,
  addCustomForUserWithProfile,
  addItemsFromPlugin,
  addCustomForUser,
  removeAll,
} = require('../core/menu-item');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'menu-builder.menuItem',
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
    enable: {
      handler(ctx) {
        return enable({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    removeAll: {
      handler(ctx) {
        return removeAll({ ...ctx.params, ctx });
      },
    },
    addCustomForUser: {
      handler(ctx) {
        return addCustomForUser({ ...ctx.params, ctx });
      },
    },
    addItemsFromPlugin: {
      handler(ctx) {
        return addItemsFromPlugin({ ...ctx.params, ctx });
      },
    },
    addCustomForUserWithProfile: {
      handler(ctx) {
        return addCustomForUserWithProfile({ ...ctx.params, ctx });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
