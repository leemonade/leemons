/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { PLUGIN_NAME } = require('../config/constants');
const {
  remove,
  getByItem,
  getByType,
  getById,
  getByIds,
  getByItems,
  setItem,
} = require('../core/customPeriods');
const { getServiceModels } = require('../models');

const restActions = require('./rest/customPeriod.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.custom-period`,
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    setItem: {
      handler(ctx) {
        return setItem({ ...ctx.params, ctx });
      },
    },
    getByItem: {
      handler(ctx) {
        return getByItem({ ...ctx.params, ctx });
      },
    },
    getByItems: {
      handler(ctx) {
        return getByItems({ ...ctx.params, ctx });
      },
    },
    getByType: {
      handler(ctx) {
        return getByType({ ...ctx.params, ctx });
      },
    },
    getById: {
      handler(ctx) {
        return getById({ ...ctx.params, ctx });
      },
    },
    getByIds: {
      handler(ctx) {
        return getByIds({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
  },
};
