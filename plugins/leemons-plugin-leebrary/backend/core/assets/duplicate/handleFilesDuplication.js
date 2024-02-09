const _ = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { duplicate: duplicateFile } = require('../../files/duplicate');
const { add: addFiles } = require('../files/add/add');
/**
 * Handles the duplication of files associated with a given asset.
 * It duplicates each file, excluding the cover, and updates the new asset with the duplicated files.
 * If the asset has a cover, it is added to the files array.
 * The function returns the updated asset.
 *
 * @param {Object} params - An object containing the parameters
 * @param {Array} params.filesToDuplicate - An array of file objects
 * @param {Object} params.cover - The cover file object
 * @param {Object} params.newAsset - The new asset object
 * @param {Object} params.category - The category object
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<Object>} - Returns a promise with the updated asset
 */
async function handleFilesDuplication({ filesToDuplicate, cover, newAsset, category, ctx }) {
  let newFiles = [];
  const isMediaFile = category.key === CATEGORIES.MEDIA_FILES;

  // EN: Duplicate all the files
  if (filesToDuplicate?.length) {
    const toDuplicatePromises = [];

    _.forEach(filesToDuplicate, (file) => {
      toDuplicatePromises.push(duplicateFile({ file, ctx }));
    });

    newFiles = await Promise.all(toDuplicatePromises);
  }

  // EN: If the asset is a MediaFile, and has NO files, means it is an Image, and the cover is the file
  if (isMediaFile && _.isEmpty(newFiles) && cover?.id) {
    newFiles.push(cover);
  }

  // EN: Now, let's create the relation between the file and Asset
  const addFileToAssetPromises = [];
  _.forEach(newFiles, (file) => {
    addFileToAssetPromises.push(
      addFiles({
        fileId: file.id,
        assetId: newAsset.id,
        skipPermissions: true,
        ctx,
      })
    );
  });

  await Promise.allSettled(addFileToAssetPromises);

  // If the new asset doesn't have a cover, assign the first file in the newFiles array to the newAsset.file
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (!_.isEmpty(newFiles)) {
    // eslint-disable-next-line no-param-reassign
    [newAsset.file] = newFiles;
  }

  return newAsset;
}

module.exports = { handleFilesDuplication };
