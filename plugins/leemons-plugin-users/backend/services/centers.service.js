/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const {
  LeemonsDeploymentManagerMixin,
  validateInternalPrivateKey,
} = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { add, list, detail, existName, existsById, getByIds } = require('../core/centers');
const { setLimits } = require('../core/centers/setLimits');
const { getServiceModels } = require('../models');

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
    existsById: {
      async handler(ctx) {
        return existsById({ ...ctx.params, ctx });
      },
    },
    setLimits: {
      async handler(ctx) {
        validateInternalPrivateKey({ ctx });
        return setLimits({ ...ctx.params, ctx });
      },
    },
    getByIds: {
      async handler(ctx) {
        return getByIds({ ...ctx.params, ctx });
      },
    },
  },
};
