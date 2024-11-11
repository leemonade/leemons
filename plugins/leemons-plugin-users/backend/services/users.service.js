/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsCronJobsMixin } = require('@leemons/cronjobs');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const _ = require('lodash');

const { PLUGIN_NAME, VERSION } = require('../config/constants');
const {
  getUserAgentPermissions,
  userAgentHasCustomPermission,
  addCustomPermissionToUserAgent,
} = require('../core/permissions');
const { getProvider } = require('../core/providers/getProvider');
const {
  getUserAgentsInfo,
  searchUserAgents,
  filterUserAgentsByProfileAndCenter,
  getUserAgentByCenterProfile,
  getUserAgentCenter,
} = require('../core/user-agents');
const { addUserAgentContacts } = require('../core/user-agents/contacts/addUserAgentContacts');
const { getUserAgentContactIds } = require('../core/user-agents/contacts/getUserAgentContactIds');
const { getUserAgentContacts } = require('../core/user-agents/contacts/getUserAgentContacts');
const { removeUserAgentContacts } = require('../core/user-agents/contacts/removeUserAgentContacts');
const { userAgentsAreContacts } = require('../core/user-agents/contacts/userAgentsAreContacts');
const {
  getAllItemsForTheUserAgentHasPermissions,
} = require('../core/user-agents/item-permissions/getAllItemsForTheUserAgentHasPermissions');
const {
  getAllItemsForTheUserAgentHasPermissionsByType,
} = require('../core/user-agents/item-permissions/getAllItemsForTheUserAgentHasPermissionsByType');
const {
  userAgentHasPermissionToItem,
} = require('../core/user-agents/item-permissions/userAgentHasPermissionToItem');
const {
  removeCustomUserAgentPermission,
} = require('../core/user-agents/permissions/removeCustomUserAgentPermission');
const {
  updateUserAgentPermissions,
} = require('../core/user-agents/permissions/updateUserAgentPermissions');
const {
  userAgentHasPermission,
} = require('../core/user-agents/permissions/userAgentHasPermission');
const {
  add,
  detail,
  addBulk,
  centers,
  updateEmail,
  isSuperAdmin,
  updatePassword,
  list: listUsers,
  userSessionCheckUserAgentDatasets,
  getSuperAdminUserIds,
} = require('../core/users');
const getUserLocale = require('../core/users/getUserLocale');
const { loginWithProvider } = require('../core/users/loginWithProvider');
const { getServiceModels } = require('../models');

const { jobs } = require('./jobs/users.jobs');
const restActions = require('./rest/users.rest');

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
    listUsers: {
      async handler(ctx) {
        const provider = (await getProvider({ ctx }))?.pluginName;

        if (
          ctx.callerPlugin &&
          [provider, 'bulk-data'].filter(Boolean).includes(ctx.callerPlugin)
        ) {
          return listUsers({ ...ctx.params, ctx });
        }
        return {};
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
    loginWithProvider: {
      async handler(ctx) {
        return loginWithProvider({ ...ctx.params, ctx });
      },
    },
    getUserLocale: {
      async handler(ctx) {
        const { email, fallback } = ctx.params;
        const provider = (await getProvider({ ctx }))?.pluginName;

        if (!ctx.callerPlugin || ctx.callerPlugin !== provider) {
          return fallback;
        }

        return getUserLocale({ email, ctx });
      },
    },
    getSuperAdminUserIds: {
      async handler(ctx) {
        // TODO Bring all plugin names from my deployment and make sure ctx.callerPlugin is in the list
        return getSuperAdminUserIds({ ...ctx.params, ctx });
      },
    },
  },
};
