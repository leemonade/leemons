/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const restActions = require('./rest/categories.rest');
const { add } = require('../core/categories/add');
const { removeByKey } = require('../core/categories/removeByKey');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.categories`,
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
    removeByKey: {
      handler(ctx) {
        return removeByKey({ ...ctx.params, ctx });
      },
    },
  },
};
