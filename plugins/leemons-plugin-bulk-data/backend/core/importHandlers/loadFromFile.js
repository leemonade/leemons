const { LeemonsError } = require('@leemons/error');

const { createTempFile } = require('../helpers/createTempFile');
const { importBulkData } = require('./importBulkData');

async function loadFromFile(ctx, { isAsync = false }) {
  const settings = await ctx.call('admin.settings.findOne');

  try {
    if (settings?.status !== 'INSTALLED' && !settings?.configured) {
      const file = await createTempFile({ readStream: ctx.params });
      if (isAsync) {
        importBulkData({ docPath: file.path, useCache: false, ctx });
        return { status: 200, currentPhase: 'Proccessing file', overallProgress: '0%' };
      }
      await importBulkData({ docPath: file.path, useCache: false, ctx });
      return { status: 200 };
    }
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Something went wrong importing from file: ${error}`,
      httpStatusCode: 500,
    });
  }
  throw new LeemonsError(ctx, { message: 'Unexpected error', httpStatusCode: 500 });
}

module.exports = { loadFromFile };
