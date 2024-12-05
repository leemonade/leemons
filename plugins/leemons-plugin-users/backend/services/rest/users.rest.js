/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsError } = require('@leemons/error');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

const { detailBySysName } = require('../../core/profiles');
const {
  update,
  active,
  disable,
  deleteById,
  searchUserAgents,
  getUserAgentsInfo,
  agentDetailForPage,
  getDataForUserAgentDatasets,
  saveDataForUserAgentDatasets,
  getActiveUserAgentsCountByProfileSysName,
} = require('../../core/user-agents');
const { getUserAgentContacts } = require('../../core/user-agents/contacts/getUserAgentContacts');
const { userAgentsAreContacts } = require('../../core/user-agents/contacts/userAgentsAreContacts');
const { getDataForUserDatasets, saveDataForUserDatasets } = require('../../core/users');
const usersService = require('../../core/users');
const { impersonateUser } = require('../../core/users/impersonateUser');

module.exports = {
  canResetRest: {
    rest: {
      path: '/can/reset',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const can = await usersService.canReset({ token: ctx.params.token, ctx });
        return { status: 200, can };
      }
      throw validator.error;
    },
  },
  canRegisterPasswordRest: {
    rest: {
      path: '/can/register-password',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const can = await usersService.canRegisterPassword({ token: ctx.params.token, ctx });
        return { status: 200, can };
      }
      throw validator.error;
    },
  },
  resetRest: {
    rest: {
      path: '/reset',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['token', 'password'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const user = await usersService.reset({
          token: ctx.params.token,
          password: ctx.params.password,
          ctx,
        });

        ctx.$statusCode = 200;
        return { status: 200, user };
      }
      throw validator.error;
    },
  },
  registerPasswordRest: {
    rest: {
      path: '/register-password',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['token', 'password'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const user = await usersService.registerPassword({
          token: ctx.params.token,
          password: ctx.params.password,
          ctx,
        });

        return { status: 200, user };
      }
      throw validator.error;
    },
  },
  recoverRest: {
    rest: {
      path: '/recover',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
        },
        required: ['email'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        try {
          await usersService.recover({ email: ctx.params.email, ctx });
        } catch (e) {
          // Always send 200 so hackers can't know if the email exists
        }

        ctx.meta.$statusCode = 200;
        return { status: 200, message: 'Email sent' };
      }
      throw validator.error;
    },
  },
  loginRest: {
    rest: {
      path: '/login',
      method: 'POST',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
          },
        },
        required: ['email', 'password'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await usersService.login({
          email: ctx.params.email,
          password: ctx.params.password,
          ctx,
        });
        return { status: 200, user: data.user, jwtToken: data.token };
      }
      throw validator.error;
    },
  },
  detailRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const user = await usersService.detail({ userId: ctx.meta.userSession.id, ctx });
      return { status: 200, user };
    },
  },
  detailForPageRest: {
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
        hasPermission = await usersService.hasPermissionCTX({ allowedPermissions, ctx });
      }

      const user = await usersService.detailForPage({ userId: ctx.params.id, ctx });
      const data = {
        ...(user ?? {}),
        user: _.omit(user?.user, ['password', 'token', '__v']),
        userAgents: user?.userAgents?.map((userAgent) => _.omit(userAgent, ['user'])),
      };

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
        hasPermission = await usersService.hasPermissionCTX({ allowedPermissions, ctx });
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
        const data = await agentDetailForPage({ userAgentId: ctx.params.id, ctx });
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
    rest: {
      path: '/profile',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const profiles = await usersService.profiles({ user: ctx.meta.userSession.id, ctx });
      return { status: 200, profiles };
    },
  },
  centersRest: {
    rest: {
      path: '/centers',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const centers = await usersService.centers({ user: ctx.meta.userSession.id, ctx });
      return { status: 200, centers };
    },
  },
  profileTokenRest: {
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
  impersonateRest: {
    rest: {
      path: '/impersonate/:userId',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'users.impersonate': {
            actions: ['admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const jwtToken = await impersonateUser({ id: ctx.params.userId, ctx });

      return { status: 200, jwtToken };
    },
  },
  setRememberLoginRest: {
    rest: {
      path: '/remember/login',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const centers = await usersService.centers({ user: ctx.meta.userSession.id, ctx });
      const centerI = _.findIndex(centers, { id: ctx.params.center });
      const isSuperAdminProfile =
        centerI < 0 && (await detailBySysName({ sysName: 'super', ctx })).id === ctx.params.profile;

      if (centerI >= 0 || isSuperAdminProfile) {
        const profileI = _.findIndex(centers[centerI]?.profiles, { id: ctx.params.profile });
        if (profileI >= 0 || isSuperAdminProfile) {
          await ctx.tx.db.UserRememberLogin.updateOne(
            { user: ctx.meta.userSession.id },
            {
              user: ctx.meta.userSession.id,
              profile: ctx.params.profile,
              center: ctx.params.center ?? null,
            },
            { upsert: true }
          );
          return {
            status: 200,
            profile: isSuperAdminProfile
              ? ctx.params.profile
              : centers[centerI]?.profiles[profileI],
            center: isSuperAdminProfile ? null : centers[centerI],
          };
        }
        throw new LeemonsError(ctx, { message: 'You do not have access to the specified profile' });
      } else {
        throw new LeemonsError(ctx, { message: 'You do not have access to the specified center' });
      }
    },
  },
  removeRememberLoginRest: {
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
        await ctx.tx.db.UserRememberLogin.deleteOne({ user: ctx.meta.userSession.id });
      }
      return { status: 200 };
    },
  },
  getRememberLoginRest: {
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
        const centers = await usersService.centers({ user: ctx.meta.userSession.id, ctx });
        const centerI = _.findIndex(centers, { id: remember.center });

        const superAdminProfile = centerI < 0 && (await detailBySysName({ sysName: 'super', ctx }));
        const isSuperAdminProfile = centerI < 0 && superAdminProfile.id === remember.profile;

        if (centerI >= 0 || isSuperAdminProfile) {
          const profileI = _.findIndex(centers[centerI]?.profiles, { id: remember.profile });
          if (profileI >= 0) {
            return {
              status: 200,
              profile: centers[centerI].profiles[profileI],
              center: centers[centerI],
            };
          }
          if (isSuperAdminProfile) {
            return { status: 200, profile: superAdminProfile, center: null };
          }
          return { status: 200, profile: null, center: null };
        }
        return { status: 200, profile: null, center: null };
      }
      return { status: 200, profile: null, center: null };
    },
  },
  createBulkRest: {
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
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: 'number' },
          size: { type: 'number' },
          query: { type: 'object', additionalProperties: true },
          sort: { type: 'object', additionalProperties: true },
          collation: { type: 'object', additionalProperties: true },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const data = await usersService.list({
          page: ctx.params.page,
          size: ctx.params.size,
          sort: ctx.params.sort,
          collation: ctx.params.collation,
          ...ctx.params.query,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  getUserAgentsInfoRest: {
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
    rest: {
      path: '/get-data-for-user-agent-datasets',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await getDataForUserAgentDatasets({ userAgentId: ctx.params?.userAgentId, ctx });
      return { status: 200, data };
    },
  },

  saveDataForUserAgentDatasetsRest: {
    rest: {
      path: '/save-data-for-user-agent-datasets',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await saveDataForUserAgentDatasets({
        data: ctx.params,
        ctx,
      });
      return { status: 200, data };
    },
  },
  getDataForUserDatasetsRest: {
    rest: {
      path: '/get-data-for-user-datasets',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await getDataForUserDatasets({ userIds: [ctx.params?.userId], ctx });
      return { status: 200, data };
    },
  },

  saveDataForUserDatasetsRest: {
    rest: {
      path: '/save-data-for-user-datasets',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await saveDataForUserDatasets({
        data: ctx.params,
        ctx,
      });
      return { status: 200, data };
    },
  },
  updateUserRest: {
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
        hasPermission = await usersService.hasPermissionCTX({ allowedPermissions, ctx });
      }

      if (hasPermission) {
        const data = await usersService.update({ userId: ctx.params.id, ...ctx.params, ctx });
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
        hasPermission = await usersService.hasPermissionCTX({ allowedPermissions, ctx });
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
        hasPermission = await usersService.hasPermissionCTX({ allowedPermissions, ctx });
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
  getActiveUserAgentsCountByProfileSysNameRest: {
    rest: {
      path: '/user-agents/active-count/:sysName',
      method: 'GET',
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
      const { sysName } = ctx.params;
      const count = await getActiveUserAgentsCountByProfileSysName({
        sysName,
        ctx,
      });
      return { status: 200, count };
    },
  },
  checkUserAgentDatasetsRest: {
    rest: {
      path: '/user-agents/check-datasets',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const isGood = await usersService.userSessionCheckUserAgentDatasets({ ctx });
      if (!isGood) {
        const userAgent = ctx.meta.userSession.userAgents[0].id;
        ctx.socket.emit(userAgent, 'USER_AGENT_NEED_UPDATE_DATASET');
      }
      return { isGood };
    },
  },
};
