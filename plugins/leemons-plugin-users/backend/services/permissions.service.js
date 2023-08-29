/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const {
  add,
  update,
  remove,
  exist,
  addMany,
  existMany,
  hasAction,
  addAction,
  updateMany,
  removeMany,
  hasActionMany,
  addActionMany,
  findUsersWithPermissions,
  findUserAgentsWithPermission,
  removeCustomPermissionForAllUserAgents,
  manyPermissionsHasManyActions,
} = require('../core/permissions');
const {
  permissions: {
    getUserAgentPermissions,
    userAgentHasPermission,
    userAgentHasCustomPermission,
    addCustomPermissionToUserAgent,
    removeCustomUserAgentPermission,
  },
  itemPermissions: {
    getAllItemsForTheUserAgentHasPermissions,
    userAgentHasPermissionToItem,
    getAllItemsForTheUserAgentHasPermissionsByType,
  },
} = require('../core/user-agents');
const itemPermissions = require('../core/item-permissions');
const { getServiceModels } = require('../models');
const {
  addCustomPermissionToUserProfile,
  removeCustomPermissionToUserProfile,
} = require('../core/user-profile');
const restActions = require('./rest/permissions.rest');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.permissions',
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
    ...restActions,
    add: {
      handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    exist: {
      handler(ctx) {
        return exist({ ...ctx.params, ctx });
      },
    },
    remove: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    // TODO: Buscar todos los que usen delete y cambiarlos a remove
    delete: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    addMany: {
      handler(ctx) {
        return addMany({ ...ctx.params, ctx });
      },
    },
    existMany: {
      handler(ctx) {
        return existMany({ ...ctx.params, ctx });
      },
    },
    hasAction: {
      handler(ctx) {
        return hasAction({ ...ctx.params, ctx });
      },
    },
    addAction: {
      handler(ctx) {
        return addAction({ ...ctx.params, ctx });
      },
    },
    updateMany: {
      handler(ctx) {
        return updateMany({ ...ctx.params, ctx });
      },
    },
    removeMany: {
      handler(ctx) {
        return removeMany({ ...ctx.params, ctx });
      },
    },
    hasActionMany: {
      handler(ctx) {
        return hasActionMany({ ...ctx.params, ctx });
      },
    },
    addActionMany: {
      handler(ctx) {
        return addActionMany({ ...ctx.params, ctx });
      },
    },
    findUsersWithPermissions: {
      handler(ctx) {
        return findUsersWithPermissions({ ...ctx.params, ctx });
      },
    },
    findUserAgentsWithPermission: {
      handler(ctx) {
        return findUserAgentsWithPermission({ ...ctx.params, ctx });
      },
    },
    removeCustomPermissionForAllUserAgents: {
      handler(ctx) {
        return removeCustomPermissionForAllUserAgents({ ...ctx.params, ctx });
      },
    },
    manyPermissionsHasManyActions: {
      handler(ctx) {
        return manyPermissionsHasManyActions({ ...ctx.params, ctx });
      },
    },

    // User agent
    getUserAgentPermissions: {
      handler(ctx) {
        return getUserAgentPermissions({ ...ctx.params, ctx });
      },
    },
    userAgentHasPermission: {
      handler(ctx) {
        return userAgentHasPermission({ ...ctx.params, ctx });
      },
    },
    userAgentHasCustomPermission: {
      handler(ctx) {
        return userAgentHasCustomPermission({ ...ctx.params, ctx });
      },
    },
    addCustomPermissionToUserAgent: {
      handler(ctx) {
        return addCustomPermissionToUserAgent({ ...ctx.params, ctx });
      },
    },
    removeCustomUserAgentPermission: {
      handler(ctx) {
        return removeCustomUserAgentPermission({ ...ctx.params, ctx });
      },
    },

    // User agent - Item permissions
    userAgentHasPermissionToItem: {
      handler(ctx) {
        return userAgentHasPermissionToItem({ ...ctx.params, ctx });
      },
    },
    getAllItemsForTheUserAgentHasPermissions: {
      handler(ctx) {
        return getAllItemsForTheUserAgentHasPermissions({ ...ctx.params, ctx });
      },
    },
    getAllItemsForTheUserAgentHasPermissionsByType: {
      handler(ctx) {
        return getAllItemsForTheUserAgentHasPermissionsByType({ ...ctx.params, ctx });
      },
    },

    // Item permissions
    addItem: {
      handler(ctx) {
        return itemPermissions.add({ ...ctx.params, ctx });
      },
    },
    findItems: {
      handler(ctx) {
        return itemPermissions.find({ ...ctx.params, ctx });
      },
    },
    existItems: {
      handler(ctx) {
        return itemPermissions.exist({ ...ctx.params, ctx });
      },
    },
    countItems: {
      handler(ctx) {
        return itemPermissions.count({ ...ctx.params, ctx });
      },
    },
    removeItems: {
      handler(ctx) {
        return itemPermissions.remove({ ...ctx.params, ctx });
      },
    },
    addItemBasicIfNeed: {
      handler(ctx) {
        return itemPermissions.addBasicIfNeed({ ...ctx.params, ctx });
      },
    },
    getItemPermissions: {
      handler(ctx) {
        return itemPermissions.getItemPermissions({ ...ctx.params, ctx });
      },
    },
    getUserAgentsWithPermissionsForItem: {
      handler(ctx) {
        return itemPermissions.getUserAgentsWithPermissionsForItem({ ...ctx.params, ctx });
      },
    },

    // User profile
    addCustomPermissionToUserProfile: {
      handler(ctx) {
        return addCustomPermissionToUserProfile({ ...ctx.params, ctx });
      },
    },
    removeCustomPermissionToUserProfile: {
      handler(ctx) {
        return removeCustomPermissionToUserProfile({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
