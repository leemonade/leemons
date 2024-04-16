/** @type {import('moleculer').ServiceSchema} */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');

const { getServiceModels } = require('../models');
const { registerRole, unregisterRole } = require('../core/roles');
const restActions = require('./rest/roles.rest');

module.exports = {
  name: 'assignables.roles',
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

    registerRole: {
      handler(ctx) {
        return registerRole({ ...ctx.params, ctx });
      },
    },
    unregisterRole: {
      handler(ctx) {
        return unregisterRole({ ...ctx.params, ctx });
      },
    },
  },
};
