/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const {
  setProfiles,
  getProfiles,
  setActiveProvider,
  getActiveProvider,
} = require('../core/settings');
const { getServiceModels } = require('../models');

const restActions = require('./rest/settings.rest');

const menuBuilderEnableMenuItem = 'menu-builder.menuItem.enable';

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.settings',
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
    setProfiles: {
      handler(ctx) {
        return setProfiles({ ...ctx.params, ctx });
      },
    },
    getProfiles: {
      handler(ctx) {
        return getProfiles({ ctx });
      },
    },
    enableAllMenuItems: {
      handler(ctx) {
        return Promise.all([
          ctx.tx.call(menuBuilderEnableMenuItem, { key: ctx.prefixPN('programs') }),
          ctx.tx.call(menuBuilderEnableMenuItem, { key: ctx.prefixPN('profiles') }),
          ctx.tx.call(menuBuilderEnableMenuItem, { key: ctx.prefixPN('subjects') }),
          ctx.tx.call(menuBuilderEnableMenuItem, { key: ctx.prefixPN('tree') }),
        ]);
      },
    },
    setActiveProvider: {
      handler(ctx) {
        return setActiveProvider({ ...ctx.params, ctx });
      },
    },
    getActiveProvider: {
      handler(ctx) {
        return getActiveProvider({ ...ctx.params, ctx });
      },
    },
  },
};
