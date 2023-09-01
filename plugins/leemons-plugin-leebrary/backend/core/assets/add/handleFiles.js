const { isString } = require('lodash');
const { add: addFiles } = require('../files/add');
/**
 * Handles the files of the asset.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {Object} params.newFile - The new file of the asset.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context.

 */
async function handleFiles({ newFile, assetId, ctx }) {
  if (isString(newFile?.id)) {
    try {
      await addFiles({ fileId: newFile.id, assetId, skipPermissions: true, ctx });
      return true;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  return false;
}

module.exports = { handleFiles };
