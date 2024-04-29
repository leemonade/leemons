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

const savePackageRest = require('./openapi/package/savePackageRest');
const duplicatePackageRest = require('./openapi/package/duplicatePackageRest');
const assignPackageRest = require('./openapi/package/assignPackageRest');
const sharePackageRest = require('./openapi/package/sharePackageRest');
const getSupportedVersionsRest = require('./openapi/package/getSupportedVersionsRest');
const getPackageRest = require('./openapi/package/getPackageRest');
const deletePackageRest = require('./openapi/package/deletePackageRest');
/** @type {ServiceSchema} */
module.exports = {
  savePackageRest: {
    openapi: savePackageRest.openapi,
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
    openapi: duplicatePackageRest.openapi,
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
    openapi: assignPackageRest.openapi,
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
    openapi: sharePackageRest.openapi,
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
    openapi: getSupportedVersionsRest.openapi,
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
    openapi: getPackageRest.openapi,
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
    openapi: deletePackageRest.openapi,
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
