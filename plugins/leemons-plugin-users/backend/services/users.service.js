/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const { getUserAgentCenter } = require('../core/user-agents/getUserAgentCenter');
const usersServices = require('../core/users');
const Rest = require('./users.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.users',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
    Rest,
  ],
  actions: {
    updateEmail: {
      async handler(ctx) {
        return usersServices.updateEmail({ ...ctx.params, ctx });
      },
    },
    updatePassword: {
      async handler(ctx) {
        return usersServices.updatePassword({ ...ctx.params, ctx });
      },
    },
    getUserAgentCenter: {
      async handler(ctx) {
        return getUserAgentCenter({ ...ctx.params, ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
