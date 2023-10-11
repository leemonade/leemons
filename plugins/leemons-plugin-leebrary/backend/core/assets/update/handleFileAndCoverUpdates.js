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
  let coverFile;

  if (fileNeedsUpdate && !isEmpty(file)) {
    newFile = await uploadFromSource({ source: file, name: assetData.name, ctx });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
      filesToRemove.push(cover);
    }

    await addFiles({ fileId: newFile.id, assetId, ctx });
    delete updateObject.file;
  }

  if (coverNeedsUpdate && !coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource({ source: cover, name: assetData.name, ctx });
  }

  if (coverFile?.id) {
    updateObject.cover = coverFile.id;
  }

  // ES: En caso de que no hayan cambio en los archivos, los dejamos establecidos con su valor actual
  // EN: If there are no changes in the files, we keep the current values
  if (!newFile && !fileNeedsUpdate) {
    newFile = currentAsset.file;
  }

  if (!coverFile && !coverNeedsUpdate) {
    coverFile = currentAsset.cover;
  }

  return { newFile, coverFile, toUpdate: updateObject, filesToRemove };
}

module.exports = { handleFileAndCoverUpdates };
