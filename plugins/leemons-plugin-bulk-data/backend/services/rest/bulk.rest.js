const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { generateBulkDataFile } = require('../../core/generateBulkDataFile');
const {
  loadFromFile,
  getLoadStatus,
  loadFromTemplateURL,
  getStatusWhenLocal,
} = require('../../core/importHandlers');

module.exports = {
  loadRest: {
    rest: {
      path: '/load-from-file',
      method: 'POST',
      type: 'multipart',
    },
    timeout: 0,
    async handler(ctx) {
      return loadFromFile(ctx, { isAsync: true });
    },
  },
  loadRestSync: {
    rest: {
      path: '/load-from-file-sync',
      method: 'POST',
      type: 'multipart',
    },
    timeout: 0,
    async handler(ctx) {
      return loadFromFile(ctx, { isAsync: false });
    },
  },
  loadFromTemplateURLRest: {
    rest: {
      path: '/load-from-template-url',
      method: 'POST',
    },
    timeout: 0,
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { templateURL, shareLibraryAssetsWithTeacherProfile } = ctx.params;
      return loadFromTemplateURL({ templateURL, shareLibraryAssetsWithTeacherProfile, ctx });
    },
  },
  getLocalLoadStatusRest: {
    rest: {
      path: '/load-from-file', // todo update
      method: 'GET',
    },
    handler() {
      return getStatusWhenLocal();
    },
  },
  getLoadStatusRest: {
    rest: {
      path: '/get-load-status',
      method: 'GET',
    },
    async handler(ctx) {
      return getLoadStatus({ useCache: true, initOnPhase: ctx.params?.initOnPhase, ctx });
    },
  },
  generateBulkDataRest: {
    rest: {
      path: '/generate-bulk-data',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],

    async handler(ctx) {
      const { admin, superAdmin, noUsers, isClientManagerTemplate, writeFileLocally } = ctx.params;
      const result = await generateBulkDataFile({
        admin,
        superAdmin,
        noUsers,
        isClientManagerTemplate,
        writeFileLocally,
        ctx,
      });
      return { status: 200, result };
    },
  },
};
