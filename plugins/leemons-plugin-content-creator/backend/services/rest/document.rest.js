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
  saveDocument,
  getDocument,
  deleteDocument,
  duplicateDocument,
  assignDocument,
  shareDocument,
} = require('../../core/document');
const {
  permissions: { names: permissions },
} = require('../../config/constants');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

/** @type {ServiceSchema} */
module.exports = {
  saveDocumentRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
      }),
    ],
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      const document = await saveDocument({ data, ctx });
      return { status: 200, document };
    },
  },
  getDocumentRest: {
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const document = await getDocument({ id: ctx.params.id, ctx });
      return { status: 200, document };
    },
  },
  deleteDocumentRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: getPermissions(permissions.creator, ['delete']),
      }),
    ],
    async handler(ctx) {
      const document = await deleteDocument({ id: ctx.params.id, ctx });
      return { status: 200, document };
    },
  },
  duplicateDocumentRest: {
    rest: {
      method: 'POST',
      path: '/duplicate',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
      }),
    ],
    async handler(ctx) {
      const document = await duplicateDocument({
        id: ctx.params.id,
        published: ctx.params.published,
        ctx,
      });
      return { status: 200, document };
    },
  },
  assignDocumentRest: {
    rest: {
      method: 'POST',
      path: '/assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
      }),
    ],
    async handler(ctx) {
      const { id, data } = ctx.params;
      const document = await assignDocument({ id, data, ctx });
      return { status: 200, document };
    },
  },
  shareDocumentRest: {
    rest: {
      method: 'POST',
      path: '/share',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { assignableId, canAccess } = ctx.params;
      const docPermissions = await shareDocument({ id: assignableId, canAccess, ctx });
      return { status: 200, docPermissions };
    },
  },
};
