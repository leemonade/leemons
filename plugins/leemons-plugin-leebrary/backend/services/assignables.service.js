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
const restActions = require('./rest/assignables.rest');
const createAssignableFromAsset = require('../core/assignables/createAssignableFromAsset');
const updateAssignableOnAssign = require('../core/assignables/updateAssignableOnAssign');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.assignables`,
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
    create: {
      async handler(ctx) {
        const { assignable } = ctx.params;
        return createAssignableFromAsset({ assignable, ctx });
      },
    },
    updateForModules: {
      async handler(ctx) {
        const { instance } = ctx.params;
        return updateAssignableOnAssign({ instance, ctx });
      },
    },
  },
};
