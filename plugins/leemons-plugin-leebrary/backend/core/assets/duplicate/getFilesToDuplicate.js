const _ = require('lodash');
const { getByIds: getFiles } = require('../../files/getByIds/getByIds');
/**
 * Handles files and cover associated with an asset.
 * It retrieves the files using their IDs and finds the cover file among them.
 *
 * @param {Object} params - An object containing the parameters.
 * @param {Array<string>} params.filesIds - An array of file IDs.
 * @param {string} params.coverId - The ID of the cover file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns a promise with an object containing the files and the cover.
 */
async function getFilesToDuplicate({ filesIds, coverId, ctx }) {
  const filesToDuplicate = await getFiles({ fileIds: filesIds, parsed: false, ctx });
  const cover = _.find(filesToDuplicate, { id: coverId });

  return { filesToDuplicate, cover };
}

module.exports = { getFilesToDuplicate };
