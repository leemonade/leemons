/* eslint-disable no-param-reassign */
const { isEmpty } = require('lodash');

const { uploadFromSource } = require('../../files/helpers/uploadFromSource');
const { add: addFiles } = require('../files/add');

/**
 * Handles the file and cover updates if necessary.
 * @param {Object} params - The params object
 * @param {Object} params.assetData - The asset data object.
 * @param {Array} params.diff - The object with differences.
 * @param {Object} params.updateObject - The update object.
 * @param {Object} params.currentAsset - The current asset object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The updated file and cover objects.
 */
async function handleFileAndCoverUpdates({
  assetId,
  assetData,
  updateObject,
  currentAsset,
  fileNeedsUpdate,
  coverNeedsUpdate,
  ctx,
}) {
  const { file } = assetData;
  const cover = assetData.cover || assetData.coverFile;
  const filesToRemove = [];
  let newFile;
  let newCoverFile;

  if (fileNeedsUpdate && !isEmpty(file)) {
    newFile = await uploadFromSource({ source: file, name: assetData.name, ctx });

    if (newFile?.type?.indexOf('image') === 0) {
      newCoverFile = newFile;
    }

    await addFiles({ fileId: newFile.id, assetId, ctx });
    filesToRemove.push(currentAsset.file.id);
    delete updateObject.file;
  }

  if (coverNeedsUpdate && !newCoverFile && !isEmpty(cover)) {
    newCoverFile = await uploadFromSource({ source: cover, name: assetData.name, ctx });
  }

  if (newCoverFile?.id) {
    updateObject.cover = newCoverFile.id;
  }

  // ES: En caso de que no hayan cambio en los archivos, los dejamos establecidos con su valor actual
  // EN: If there are no changes in the files, we keep the current values
  if (!newFile && !fileNeedsUpdate) {
    newFile = currentAsset.file;
  }

  if (!newCoverFile && !coverNeedsUpdate) {
    newCoverFile = currentAsset.cover;
  }

  return { newFile, coverFile: newCoverFile, toUpdate: updateObject, filesToRemove };
}

module.exports = { handleFileAndCoverUpdates };
