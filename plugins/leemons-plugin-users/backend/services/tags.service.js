/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const { getTagsRouterActions } = require('leemons-common');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.tags',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],

  actions: {
    ...getTagsRouterActions({
      middlewares: [
        LeemonsMiddlewareAuthenticated(),
        LeemonsMiddlewareNecessaryPermits({
          'users.users': {
            actions: ['update', 'create', 'delete', 'admin'],
          },
        }),
      ],
    }),
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
