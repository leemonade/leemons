/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { getTagsRouterActions } = require('@leemons/common');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'scorm.tags',
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
    ...getTagsRouterActions({
      middlewares: [
        LeemonsMiddlewareAuthenticated(),
        LeemonsMiddlewareNecessaryPermits({
          allowedPermissions: {
            'scorm.creator': {
              actions: ['update', 'create', 'delete', 'admin'],
            },
          },
        }),
      ],
    }),
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
