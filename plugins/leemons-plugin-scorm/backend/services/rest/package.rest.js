/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  savePackage,
  duplicatePackage,
  assignPackage,
  sharePackage,
  getPackage,
  deletePackage,
} = require('../../core/package');
const { supportedVersions } = require('../../config/constants');

/** @type {ServiceSchema} */
module.exports = {
  savePackageRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scorm.creator': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const scorm = await savePackage({
        scormData: ctx.params,
        ctx,
      });
      return {
        status: 200,
        package: scorm,
      };
    },
  },
  duplicatePackageRest: {
    rest: {
      method: 'POST',
      path: '/duplicate',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scorm.creator': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const scorm = await duplicatePackage({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        scorm,
      };
    },
  },
  assignPackageRest: {
    rest: {
      method: 'POST',
      path: '/assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scorm.creator': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const scorm = await assignPackage({
        ...ctx.params,
        ctx,
      });
      return {
        status: 200,
        scorm,
      };
    },
  },
  sharePackageRest: {
    rest: {
      method: 'POST',
      path: '/share',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const permissions = await sharePackage({
        id: ctx.params.assignableId,
        canAccess: ctx.params.canAccess,
        ctx,
      });
      return {
        status: 200,
        permissions,
      };
    },
  },
  getSupportedVersionsRest: {
    rest: {
      method: 'GET',
      path: '/supported-versions',
    },
    async handler(ctx) {
      return {
        status: 200,
        versions: Object.values(supportedVersions),
      };
    },
  },
  getPackageRest: {
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const scorm = await getPackage({
        id: ctx.params.id,
        ctx,
      });
      return {
        status: 200,
        scorm,
      };
    },
  },
  deletePackageRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'scorm.creator': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const scorm = await deletePackage({
        id: ctx.params.id,
        ctx,
      });
      return {
        status: 200,
        scorm,
      };
    },
  },
};
