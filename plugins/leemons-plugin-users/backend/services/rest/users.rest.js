/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

const { LeemonsError } = require('@leemons/error');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const usersService = require('../../core/users');
const { userAgentsAreContacts } = require('../../core/user-agents/contacts/userAgentsAreContacts');
const {
  agentDetailForPage,
  deleteById,
  getUserAgentsInfo,
  searchUserAgents,
  getDataForUserAgentDatasets,
  update,
  disable,
  active,
  saveDataForUserAgentDatasets,
} = require('../../core/user-agents');
const { getUserAgentContacts } = require('../../core/user-agents/contacts/getUserAgentContacts');

const canResetRest = require('./openapi/users/canResetRest');
const canRegisterPasswordRest = require('./openapi/users/canRegisterPasswordRest');
const resetRest = require('./openapi/users/resetRest');
const registerPasswordRest = require('./openapi/users/registerPasswordRest');
const recoverRest = require('./openapi/users/recoverRest');
const loginRest = require('./openapi/users/loginRest');
const detailRest = require('./openapi/users/detailRest');
const detailForPageRest = require('./openapi/users/detailForPageRest');
const agentDetailForPageRest = require('./openapi/users/agentDetailForPageRest');
const profilesRest = require('./openapi/users/profilesRest');
const centersRest = require('./openapi/users/centersRest');
const profileTokenRest = require('./openapi/users/profileTokenRest');
const centerProfileTokenRest = require('./openapi/users/centerProfileTokenRest');
const setRememberLoginRest = require('./openapi/users/setRememberLoginRest');
const removeRememberLoginRest = require('./openapi/users/removeRememberLoginRest');
const getRememberLoginRest = require('./openapi/users/getRememberLoginRest');
const createBulkRest = require('./openapi/users/createBulkRest');
const deleteUserAgentRest = require('./openapi/users/deleteUserAgentRest');
const listRest = require('./openapi/users/listRest');
const getUserAgentsInfoRest = require('./openapi/users/getUserAgentsInfoRest');

const createSuperAdminRest = require('./openapi/users/createSuperAdminRest');
const getDataForUserAgentDatasetsRest = require('./openapi/users/getDataForUserAgentDatasetsRest');
const saveDataForUserAgentDatasetsRest = require('./openapi/users/saveDataForUserAgentDatasetsRest');
const updateUserRest = require('./openapi/users/updateUserRest');
const updateUserAvatarRest = require('./openapi/users/updateUserAvatarRest');
const updateUserAgentRest = require('./openapi/users/updateUserAgentRest');
const updateSessionConfigRest = require('./openapi/users/updateSessionConfigRest');
const activateUserRest = require('./openapi/users/activateUserRest');
const sendWelcomeEmailToUserRest = require('./openapi/users/sendWelcomeEmailToUserRest');
const disableUserAgentRest = require('./openapi/users/disableUserAgentRest');
const activeUserAgentRest = require('./openapi/users/activeUserAgentRest');
/** @type {ServiceSchema} */
module.exports = {
  canResetRest: {
    openapi: canResetRest.openapi,
    rest: {
      path: '/can/reset',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      required: ['token'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const can = await usersService.canReset({ token: ctx.params.token, ctx });
      return { status: 200, can };
    },
  },
  canRegisterPasswordRest: {
    openapi: canRegisterPasswordRest.openapi,
    rest: {
      path: '/can/register-password',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      required: ['token'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const can = await usersService.canRegisterPassword({
        token: ctx.params.token,
        ctx,
      });
      return { status: 200, can };
    },
  },
  resetRest: {
    openapi: resetRest.openapi,
    rest: {
      path: '/reset',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['token', 'password'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const user = await usersService.reset({
        token: ctx.params.token,
        password: ctx.params.password,
        ctx,
      });
      return { status: 200, user };
    },
  },
  registerPasswordRest: {
    openapi: registerPasswordRest.openapi,
    rest: {
      path: '/register-password',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['token', 'password'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const user = await usersService.registerPassword({
        token: ctx.params.token,
        password: ctx.params.password,
        ctx,
      });
      return { status: 200, user };
    },
  },
  recoverRest: {
    openapi: recoverRest.openapi,
    rest: {
      path: '/recover',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
      additionalProperties: false,
    },
    async handler(ctx) {
      try {
        await usersService.recover({ email: ctx.params.email, ctx });
        return { status: 200, message: 'Email sent' };
      } catch (e) {
        console.error(e);
        // Always send 200 so hackers can't know if the email exists
        return { status: 200, code: e.code, message: 'Email sent' };
      }
    },
  },
  loginRest: {
    openapi: loginRest.openapi,
    rest: {
      path: '/login',
      method: 'POST',
    },
    params: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const data = await usersService.login({
        email: ctx.params.email,
        password: ctx.params.password,
        ctx,
      });
      return { status: 200, user: data.user, jwtToken: data.token };
    },
  },
  detailRest: {
    openapi: detailRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const user = await usersService.detail({
        userId: ctx.meta.userSession.id,
        ctx,
      });
      return { status: 200, user };
    },
  },
  detailForPageRest: {
    openapi: detailForPageRest.openapi,
    rest: {
      path: '/:id/detail/page',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allowedPermissions = {
        'users.users': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
      };
      let hasPermission = ctx.params.id === ctx.meta.userSession.id;

      if (!hasPermission) {
        hasPermission = await usersService.hasPermissionCTX({
          allowedPermissions,
          ctx,
        });
      }

      const data = await usersService.detailForPage({
        userId: ctx.params.id,
        ctx,
      });

      // Comprobamos si se tienen como contactos
      if (!hasPermission) {
        hasPermission = await userAgentsAreContacts({
          fromUserAgent: _.map(ctx.meta.userSession.userAgents, 'id'),
          toUserAgent: _.map(data.userAgents, 'id'),
          ctx,
        });
      }
      if (hasPermission) {
        return { status: 200, data };
      }

      const rAllowedPermissions = [];
      _.forIn(allowedPermissions, ({ actions }, permissionName) => {
        rAllowedPermissions.push({ permissionName, actions });
      });
      throw new LeemonsError(ctx, {
        message: `You do not have permissions. Allowed permissions: ${rAllowedPermissions.join(
          ', '
        )}.`,
        httpStatusCode: 401,
      });
    },
  },
  agentDetailForPageRest: {
    openapi: agentDetailForPageRest.openapi,
    rest: {
      path: '/user-agent/:id/detail/page',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allowedPermissions = {
        'users.users': {
          actions: ['view', 'update', 'create', 'delete', 'admin'],
        },
      };
      let hasPermission = ctx.params.id === ctx.meta.userSession.id;

      if (!hasPermission) {
        hasPermission = await usersService.hasPermissionCTX({
          allowedPermissions,
          ctx,
        });
      }

      // Comprobamos si se tienen como contactos
      if (!hasPermission) {
        hasPermission = await userAgentsAreContacts({
          fromUserAgent: _.map(ctx.meta.userSession.userAgents, 'id'),
          toUserAgent: ctx.params.id,
          ctx,
        });
      }

      if (hasPermission) {
        const data = await agentDetailForPage({
          userAgentId: ctx.params.id,
          ctx,
        });
        return { status: 200, data };
      }
      const rAllowedPermissions = [];
      _.forIn(allowedPermissions, ({ actions }, permissionName) => {
        rAllowedPermissions.push({ permissionName, actions });
      });
      throw new LeemonsError(ctx, {
        message: `You do not have permissions. Allowed permissions: ${rAllowedPermissions.join(
          ', '
        )}.`,
        httpStatusCode: 401,
      });
    },
  },
  profilesRest: {
    openapi: profilesRest.openapi,
    rest: {
      path: '/profile',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const profiles = await usersService.profiles({
        user: ctx.meta.userSession.id,
        ctx,
      });
      return { status: 200, profiles };
    },
  },
  centersRest: {
    openapi: centersRest.openapi,
    rest: {
      path: '/centers',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const centers = await usersService.centers({
        user: ctx.meta.userSession.id,
        ctx,
      });
      return { status: 200, centers };
    },
  },
  profileTokenRest: {
    openapi: profileTokenRest.openapi,
    rest: {
      path: '/profile/:id/token',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const jwtToken = await usersService.profileToken({
        user: ctx.meta.userSession.id,
        profile: ctx.params.id,
        ctx,
      });
      return { status: 200, jwtToken };
    },
  },
  centerProfileTokenRest: {
    openapi: centerProfileTokenRest.openapi,
    rest: {
      path: '/center/:centerId/profile/:profileId/token',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const jwtToken = await usersService.centerProfileToken({
        user: ctx.meta.userSession.id,
        centerId: ctx.params.centerId,
        profileId: ctx.params.profileId,
        ctx,
      });
      return { status: 200, jwtToken };
    },
  },
  setRememberLoginRest: {
    openapi: setRememberLoginRest.openapi,
    rest: {
      path: '/remember/login',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const centers = await usersService.centers({
        user: ctx.meta.userSession.id,
        ctx,
      });
      const centerI = _.findIndex(centers, { id: ctx.params.center });
      if (centerI >= 0) {
        const profileI = _.findIndex(centers[centerI].profiles, {
          id: ctx.params.profile,
        });
        if (profileI >= 0) {
          await ctx.tx.db.UserRememberLogin.updateOne(
            { user: ctx.meta.userSession.id },
            {
              user: ctx.meta.userSession.id,
              profile: ctx.params.profile,
              center: ctx.params.center,
            },
            { upsert: true }
          );
          return {
            status: 200,
            profile: centers[centerI].profiles[profileI],
            center: centers[centerI],
          };
        }
        throw new LeemonsError(ctx, {
          message: 'You do not have access to the specified profile',
        });
      } else {
        throw new LeemonsError(ctx, {
          message: 'You do not have access to the specified center',
        });
      }
    },
  },
  removeRememberLoginRest: {
    openapi: removeRememberLoginRest.openapi,
    rest: {
      path: '/remember/login',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const remember = await ctx.tx.db.UserRememberLogin.findOne({
        user: ctx.meta.userSession.id,
      }).lean();

      if (remember) {
        await ctx.tx.db.UserRememberLogin.deleteOne({
          user: ctx.meta.userSession.id,
        });
      }
      return { status: 200 };
    },
  },
  getRememberLoginRest: {
    openapi: getRememberLoginRest.openapi,
    rest: {
      path: '/remember/login',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const remember = await ctx.tx.db.UserRememberLogin.findOne({
        user: ctx.meta.userSession.id,
      }).lean();
      if (remember) {
        const centers = await usersService.centers({
          user: ctx.meta.userSession.id,
          ctx,
        });
        const centerI = _.findIndex(centers, { id: remember.center });
        if (centerI >= 0) {
          const profileI = _.findIndex(centers[centerI].profiles, {
            id: remember.profile,
          });
          if (profileI >= 0) {
            return {
              status: 200,
              profile: centers[centerI].profiles[profileI],
              center: centers[centerI],
            };
          }
          return { status: 200, profile: null, center: null };
        }
        return { status: 200, profile: null, center: null };
      }
      return { status: 200, profile: null, center: null };
    },
  },
  createBulkRest: {
    openapi: createBulkRest.openapi,
    rest: {
      path: '/create/bulk',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['create', 'admin'],
          },
          'admin.setup': {
            actions: ['update', 'create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const users = await usersService.addBulk({ data: ctx.params, ctx });
      return { status: 200, users };
    },
  },
  deleteUserAgentRest: {
    openapi: deleteUserAgentRest.openapi,
    rest: {
      path: '/user-agent/:id',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.centers': {
            actions: ['delete', 'admin'],
          },
          'admin.setup': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await deleteById({ id: ctx.params.id, soft: true, ctx });
      return { status: 200 };
    },
  },
  listRest: {
    openapi: listRest.openapi,
    rest: {
      path: '/list',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    params: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        size: { type: 'number' },
        query: { type: 'object', additionalProperties: true },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    },
    async handler(ctx) {
      const data = await usersService.list({
        page: ctx.params.page,
        size: ctx.params.size,
        ...ctx.params.query,
        ctx,
      });
      return { status: 200, data };
    },
  },
  getUserAgentsInfoRest: {
    openapi: getUserAgentsInfoRest.openapi,
    rest: {
      path: '/user-agents/info',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const userAgents = await getUserAgentsInfo({
        userAgentIds: ctx.params.ids,
        ...ctx.params.options,
        ctx,
      });
      return { status: 200, userAgents };
    },
  },
  searchUserAgentsRest: {
    rest: {
      path: '/user-agents/search',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const userAgents = await searchUserAgents({
        ...ctx.params.filters,
        ...ctx.params.options,
        ctx,
      });
      return { status: 200, userAgents };
    },
  },
  contactsRest: {
    rest: {
      path: '/contacts',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const userAgents = await getUserAgentContacts({
        fromUserAgent: _.map(ctx.meta.userSession.userAgents, 'id'),
        ...ctx.params,
        returnAgent: true,
      });
      return { status: 200, userAgents: _.flatten(userAgents) };
    },
  },
  createSuperAdminRest: {
    openapi: createSuperAdminRest.openapi,
    rest: {
      path: '/super-admin',
      method: 'POST',
    },
    async handler(ctx) {
      return usersService.addFirstSuperAdminUser({
        name: 'Jaime',
        surnames: 'Gómez Cimarro',
        email: 'jaime@leemons.io',
        password: 'testing',
        locale: 'es-ES',
        ctx,
      });
    },
  },
  // TODO: Hacer un middleware de dataset que refleje: disableUserAgentDatasetCheck: true,
  getDataForUserAgentDatasetsRest: {
    openapi: getDataForUserAgentDatasetsRest.openapi,
    rest: {
      path: '/get-data-for-user-agent-datasets',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await getDataForUserAgentDatasets({ ctx });
      return { status: 200, data };
    },
  },

  saveDataForUserAgentDatasetsRest: {
    openapi: saveDataForUserAgentDatasetsRest.openapi,
    rest: {
      path: '/save-data-for-user-agent-datasets',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await saveDataForUserAgentDatasets({
        data: ctx.request.body,
        ctx,
      });
      return { status: 200, data };
    },
  },
  updateUserRest: {
    openapi: updateUserRest.openapi,
    rest: {
      path: '/:id/update',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allowedPermissions = {
        'users.users': {
          actions: ['update', 'admin'],
        },
      };
      let hasPermission = ctx.params.id === ctx.meta.userSession.id;

      if (!hasPermission) {
        hasPermission = await usersService.hasPermissionCTX({
          allowedPermissions,
          ctx,
        });
      }

      if (hasPermission) {
        const data = await usersService.update({
          userId: ctx.params.id,
          ...ctx.params,
          ctx,
        });
        return { status: 200, data };
      }
      const rAllowedPermissions = [];
      _.forIn(allowedPermissions, ({ actions }, permissionName) => {
        rAllowedPermissions.push({ permissionName, actions });
      });
      throw new LeemonsError(ctx, {
        message: `You do not have permissions. Allowed permissions: ${rAllowedPermissions.join(
          ', '
        )}.`,
        httpStatusCode: 401,
      });
    },
  },
  updateUserAvatarRest: {
    openapi: updateUserAvatarRest.openapi,
    rest: {
      path: '/:id/update-avatar',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allowedPermissions = {
        'users.users': {
          actions: ['update', 'admin'],
        },
      };
      let hasPermission = ctx.params.id === ctx.meta.userSession.id;

      if (!hasPermission) {
        hasPermission = await usersService.hasPermissionCTX({
          allowedPermissions,
          ctx,
        });
      }

      if (hasPermission) {
        const data = await usersService.updateAvatar({
          userId: ctx.params.id,
          avatar: ctx.params.image,
          ctx,
        });
        return { status: 200, data };
      }
      const rAllowedPermissions = [];
      _.forIn(allowedPermissions, ({ actions }, permissionName) => {
        rAllowedPermissions.push({ permissionName, actions });
      });
      throw new LeemonsError(ctx, {
        message: `You do not have permissions. Allowed permissions: ${rAllowedPermissions.join(
          ', '
        )}.`,
        httpStatusCode: 401,
      });
    },
  },
  updateUserAgentRest: {
    openapi: updateUserAgentRest.openapi,
    rest: {
      path: '/user-agent/:id/update',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allowedPermissions = {
        'users.users': {
          actions: ['update', 'admin'],
        },
      };
      let hasPermission = ctx.params.id === ctx.meta.userSession.id;

      if (!hasPermission) {
        hasPermission = await usersService.hasPermissionCTX({
          allowedPermissions,
          ctx,
        });
      }

      if (hasPermission) {
        const data = await update({
          userAgentId: ctx.params.id,
          tags: ctx.params.tags,
          ctx,
        });
        return { status: 200, data };
      }
      const rAllowedPermissions = [];
      _.forIn(allowedPermissions, ({ actions }, permissionName) => {
        rAllowedPermissions.push({ permissionName, actions });
      });
      throw new LeemonsError(ctx, {
        message: `You do not have permissions. Allowed permissions: ${rAllowedPermissions.join(
          ', '
        )}.`,
        httpStatusCode: 401,
      });
    },
  },
  updateSessionConfigRest: {
    openapi: updateSessionConfigRest.openapi,
    rest: {
      path: '/session/config',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await usersService.updateSessionConfig({ ctx });
      return { status: 200, data };
    },
  },
  activateUserRest: {
    openapi: activateUserRest.openapi,
    rest: {
      path: '/activate-user',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const user = await usersService.activateUser({
        userId: ctx.params.id,
        password: ctx.params.password,
        ctx,
      });
      return { status: 200, user };
    },
  },
  sendWelcomeEmailToUserRest: {
    openapi: sendWelcomeEmailToUserRest.openapi,
    rest: {
      path: '/activation-mail',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.users': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      try {
        const email = await usersService.sendWelcomeEmailToUser({
          user: ctx.params.user,
          ctx,
        });
        return { status: 200, email };
      } catch (e) {
        return { status: 200, code: e.code, message: 'Email sent' };
      }
    },
  },
  disableUserAgentRest: {
    openapi: disableUserAgentRest.openapi,
    rest: {
      path: '/user-agents/disable',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.enabledisable': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await disable({ id: ctx.params.userAgent, ctx });
      return { status: 200 };
    },
  },
  activeUserAgentRest: {
    openapi: activeUserAgentRest.openapi,
    rest: {
      path: '/user-agents/active',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.enabledisable': {
            actions: ['create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await active({ id: ctx.params.userAgent, ctx });
      return { status: 200 };
    },
  },
};
