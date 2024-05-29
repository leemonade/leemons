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
      // This should accept a param that indicates it's needed to get the admin data from the user session
      // Cases where the bulk data file is loaded from an admin profile
      // It also needs to be modified so that it accepts an array of users: 1 teacher and many students
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
    middlewares: [LeemonsMiddlewareAuthenticated()],
    handler(ctx) {
      const { templateURL } = ctx.params;
      return loadFromTemplateURL({ templateURL, ctx });
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
  generateBulkDataRest: {
    rest: {
      path: '/generate-bulk-data',
      method: 'POST',
    },

    async handler(ctx) {
      const { admin, superAdmin, adminShouldOwnAllAssets } = ctx.params;
      const result = await generateBulkDataFile({
        admin,
        superAdmin,
        adminShouldOwnAllAssets,
        ctx,
      });
      return { status: 200, result };
    },
  },
};
