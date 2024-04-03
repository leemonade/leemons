/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsCronJobsMixin } = require('@leemons/cronjobs');

const { getServiceModels } = require('../models');
const restActions = require('./rest/users.rest');

const {
  add,
  addBulk,
  detail,
  isSuperAdmin,
  userSessionCheckUserAgentDatasets,
  centers,
  updateEmail,
  updatePassword,
} = require('../core/users');
const {
  getUserAgentsInfo,
  searchUserAgents,
  filterUserAgentsByProfileAndCenter,
  getUserAgentByCenterProfile,
  getUserAgentCenter,
} = require('../core/user-agents');
const { userAgentsAreContacts } = require('../core/user-agents/contacts/userAgentsAreContacts');
const { getUserAgentContacts } = require('../core/user-agents/contacts/getUserAgentContacts');
const { addUserAgentContacts } = require('../core/user-agents/contacts/addUserAgentContacts');
const { removeUserAgentContacts } = require('../core/user-agents/contacts/removeUserAgentContacts');
const {
  getUserAgentPermissions,
  userAgentHasCustomPermission,
  addCustomPermissionToUserAgent,
} = require('../core/permissions');
const {
  userAgentHasPermission,
} = require('../core/user-agents/permissions/userAgentHasPermission');
const {
  updateUserAgentPermissions,
} = require('../core/user-agents/permissions/updateUserAgentPermissions');
const {
  removeCustomUserAgentPermission,
} = require('../core/user-agents/permissions/removeCustomUserAgentPermission');
const {
  userAgentHasPermissionToItem,
} = require('../core/user-agents/item-permissions/userAgentHasPermissionToItem');
const {
  getAllItemsForTheUserAgentHasPermissions,
} = require('../core/user-agents/item-permissions/getAllItemsForTheUserAgentHasPermissions');
const {
  getAllItemsForTheUserAgentHasPermissionsByType,
} = require('../core/user-agents/item-permissions/getAllItemsForTheUserAgentHasPermissionsByType');
const { getUserAgentContactIds } = require('../core/user-agents/contacts/getUserAgentContactIds');
const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { jobs } = require('./jobs/users.jobs');

/** @type {ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.users`,
  version: VERSION,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
    LeemonsCronJobsMixin({ jobs }),
  ],
  actions: {
    ...restActions,
    detail: {
      async handler(ctx) {
        const users = await detail({ ...ctx.params, ctx });
        const response = [];
        _.forEach(
          _.isArray(users) ? users : [users],
          ({ id, email, name, surnames, secondSurname, avatar, locale, createdAt }) => {
            response.push({ id, email, name, surnames, secondSurname, avatar, locale, createdAt });
          }
        );
        return _.isArray(users) ? response : response[0];
      },
    },
    isSuperAdmin: {
      async handler(ctx) {
        return isSuperAdmin({ ...ctx.params, ctx });
      },
    },
    userSessionCheckUserAgentDatasets: {
      async handler(ctx) {
        return userSessionCheckUserAgentDatasets({ ctx });
      },
    },
    getUserCenters: {
      async handler(ctx) {
        return centers({ ...ctx.params, ctx });
      },
    },
    add: {
      async handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    addBulk: {
      async handler(ctx) {
        return addBulk({ ...ctx.params, ctx });
      },
    },
    updateEmail: {
      async handler(ctx) {
        return updateEmail({ ...ctx.params, ctx });
      },
    },
    updatePassword: {
      async handler(ctx) {
        return updatePassword({ ...ctx.params, ctx });
      },
    },
    // User agents
    getUserAgentCenter: {
      async handler(ctx) {
        return getUserAgentCenter({ ...ctx.params, ctx });
      },
    },
    getUserAgentsInfo: {
      async handler(ctx) {
        return getUserAgentsInfo({ ...ctx.params, ctx });
      },
    },
    searchUserAgents: {
      async handler(ctx) {
        return searchUserAgents({ ...ctx.params, ctx });
      },
    },
    filterUserAgentsByProfileAndCenter: {
      async handler(ctx) {
        return filterUserAgentsByProfileAndCenter({ ...ctx.params, ctx });
      },
    },
    getUserAgentByCenterProfile: {
      async handler(ctx) {
        return getUserAgentByCenterProfile({ ...ctx.params, ctx });
      },
    },
    // Contacts
    userAgentsAreContacts: {
      async handler(ctx) {
        return userAgentsAreContacts({ ...ctx.params, ctx });
      },
    },
    getUserAgentContacts: {
      async handler(ctx) {
        return getUserAgentContacts({ ...ctx.params, ctx });
      },
    },
    getUserAgentContactIds: {
      async handler(ctx) {
        return getUserAgentContactIds({ ...ctx.params, ctx });
      },
    },
    addUserAgentContacts: {
      async handler(ctx) {
        return addUserAgentContacts({ ...ctx.params, ctx });
      },
    },
    removeUserAgentContacts: {
      async handler(ctx) {
        return removeUserAgentContacts({ ...ctx.params, ctx });
      },
    },

    // Permissions
    getUserAgentPermissions: {
      async handler(ctx) {
        return getUserAgentPermissions({ ...ctx.params, ctx });
      },
    },
    userAgentHasPermission: {
      async handler(ctx) {
        return userAgentHasPermission({ ...ctx.params, ctx });
      },
    },
    updateUserAgentPermissions: {
      async handler(ctx) {
        return updateUserAgentPermissions({ ...ctx.params, ctx });
      },
    },
    userAgentHasCustomPermission: {
      async handler(ctx) {
        return userAgentHasCustomPermission({ ...ctx.params, ctx });
      },
    },
    addCustomPermissionToUserAgent: {
      async handler(ctx) {
        return addCustomPermissionToUserAgent({ ...ctx.params, ctx });
      },
    },
    removeCustomUserAgentPermission: {
      async handler(ctx) {
        return removeCustomUserAgentPermission({ ...ctx.params, ctx });
      },
    },
    // Item permissions
    userAgentHasPermissionToItem: {
      async handler(ctx) {
        return userAgentHasPermissionToItem({ ...ctx.params, ctx });
      },
    },
    getAllItemsForTheUserAgentHasPermissions: {
      async handler(ctx) {
        return getAllItemsForTheUserAgentHasPermissions({ ...ctx.params, ctx });
      },
    },
    getAllItemsForTheUserAgentHasPermissionsByType: {
      async handler(ctx) {
        return getAllItemsForTheUserAgentHasPermissionsByType({ ...ctx.params, ctx });
      },
    },
  },

};
