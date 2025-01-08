/** @type {import('moleculer').ServiceSchema} */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const namespaces = require('../cache/namespaces');
const {
  createAssignable,
  getAssignable,
  getAssignables,
  updateAssignable,
  duplicateAssignable,
  removeAssignable,
  publishAssignable,
  addUserToAssignable,
  removeUserFromAssignable,
  listAssignableUserAgents,
  searchAssignables,
  findAssignableByAssetIds,
  getAssignablesAssets,
} = require('../core/assignables');
const { getUserPermission, getUserPermissions } = require('../core/permissions/assignables/users');
const { getServiceModels } = require('../models');

const restActions = require('./rest/assignables.rest');

module.exports = {
  name: 'assignables.assignables',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin({
      namespaces: [namespaces.assignables.get],
    }),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    createAssignable: {
      handler(ctx) {
        return createAssignable({ ...ctx.params, ctx });
      },
    },
    getAssignable: {
      handler(ctx) {
        return getAssignable({ ...ctx.params, ctx });
      },
    },
    getAssignables: {
      handler(ctx) {
        return getAssignables({ ...ctx.params, ctx });
      },
    },
    updateAssignable: {
      handler(ctx) {
        return updateAssignable({ ...ctx.params, ctx });
      },
    },
    duplicateAssignable: {
      handler(ctx) {
        return duplicateAssignable({ ...ctx.params, ctx });
      },
    },
    removeAssignable: {
      handler(ctx) {
        return removeAssignable({ ...ctx.params, ctx });
      },
    },
    publishAssignable: {
      handler(ctx) {
        return publishAssignable({ ...ctx.params, ctx });
      },
    },
    addUserToAssignable: {
      handler(ctx) {
        return addUserToAssignable({ ...ctx.params, ctx });
      },
    },
    removeUserFromAssignable: {
      handler(ctx) {
        return removeUserFromAssignable({ ...ctx.params, ctx });
      },
    },
    listAssignableUserAgents: {
      handler(ctx) {
        return listAssignableUserAgents({ ...ctx.params, ctx });
      },
    },
    getUserAssignablePermissions: {
      handler(ctx) {
        return getUserPermission({ ...ctx.params, ctx });
      },
    },
    getUserAssignablesPermissions: {
      handler(ctx) {
        return getUserPermissions({ ...ctx.params, ctx });
      },
    },
    searchAssignables: {
      handler(ctx) {
        return searchAssignables({ ...ctx.params, ctx });
      },
    },
    findAssignableByAssetIds: {
      handler(ctx) {
        return findAssignableByAssetIds({ ...ctx.params, ctx });
      },
    },
    getAssignablesAssets: {
      handler(ctx) {
        return getAssignablesAssets({ ...ctx.params, ctx });
      },
    },
  },

  // Esto debe eliminarse una vez hecho el merge a microservices/dev
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
