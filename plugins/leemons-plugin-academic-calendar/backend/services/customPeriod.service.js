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
  create,
  update,
  getByItems,
} = require('../core/customPeriods');
const { getServiceModels } = require('../models');

const restActions = require('./rest/customPeriod.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.customPeriod`,
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
    create: {
      handler(ctx) {
        return create({ ...ctx.params, ctx });
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
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
  },
};
