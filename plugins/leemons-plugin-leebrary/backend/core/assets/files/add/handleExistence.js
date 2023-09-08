const { LeemonsError } = require('leemons-error');
const { exists: fileExists } = require('../../../files/exists');
const { exists: assetExists } = require('../../exists');
/**
 * Check if the file and asset exist in the database
 *
 * @param {object} params - The params object
 * @param {string} params.fileId - The ID of the file to check
 * @param {string} params.assetId - The ID of the asset to check
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<void>} - Throws an error if the file or asset doesn't exist
 */
async function handleExistence({ fileId, assetId, ctx }) {
  if (!(await fileExists({ fileId, ctx }))) {
    ctx.logger.info('ERROR fileId:', fileId);
    throw new LeemonsError(ctx, { message: 'File not found', httpStatusCode: 422 });
  }

  if (!(await assetExists({ assetId, ctx }))) {
    throw new LeemonsError(ctx, { message: 'Asset not found', httpStatusCode: 422 });
  }
}

module.exports = { handleExistence };
