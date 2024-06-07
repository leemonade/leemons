const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { generateBulkDataFile } = require('../../core/generateBulkDataFile');
const { loadFromFile, getLoadStatus, loadFromTemplateURL } = require('../../core/importHandlers');

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
  statusRest: {
    rest: {
      path: '/load-from-file',
      method: 'GET',
    },
    handler() {
      return getLoadStatus();
    },
  },
  getLoadingStatusRest: {
    rest: {
      path: '/get-load-status',
      method: 'GET',
    },
    handler() {
      return getLoadStatus();
    },
  },
  generateBulkDataRest: {
    rest: {
      path: '/generate-bulk-data',
      method: 'POST',
    },

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
