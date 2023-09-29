/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const restActions = require('./rest/assets.rest');

const { getByIds } = require('../core/assets/getByIds');
const { add } = require('../core/assets/add');
const { update } = require('../core/assets/update');
const { exists } = require('../core/assets/exists');
const { remove } = require('../core/assets/files/remove');
const { duplicate } = require('../core/assets/duplicate');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.assets`,
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
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
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
    exists: {
      handler(ctx) {
        return exists({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    duplicate: {
      handler(ctx) {
        return duplicate({ ...ctx.params, ctx });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
