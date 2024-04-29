/* eslint-disable no-param-reassign */
const { isEmpty } = require('lodash');
const { LeemonsError } = require('@leemons/error');

const { validateAddAsset } = require('../../validations/forms');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { getByIds } = require('../getByIds/getByIds');
const { handleUpdateObject } = require('./handleUpdateObject');
const { handleAssetUpgrade } = require('./handleAssetUpgrade');
const { handleSubjectsUpdates } = require('./handleSubjectsUpdates');
const { handleTagsUpdates } = require('./handleTagsUpdates');
const { handleFileAndCoverUpdates } = require('./handleFileAndCoverUpdates');
const { handleFilesRemoval } = require('./handleFilesRemoval');
const { CATEGORIES } = require('../../../config/constants');

// -----------------------------------------------------------------------------
/**
 * Updates an asset in the database.
 *
 * @async
 * @function update
 * @param {Object} params - The main parameter object.
 * @param {object} params.data - The data to update the asset with.
 * @param {boolean} params.upgrade - A flag indicating whether to upgrade the asset.
 * @param {string} params.scale - The scale of the upgrade (default is 'major').
 * @param {boolean} params.published - A flag indicating whether the asset is published (default is true).
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The updated asset.
 * @throws {Error} If no changes are detected or if the user doesn't have permissions to update the asset.
 */

async function update({ data, upgrade, scale = 'major', published = true, ctx }) {
  if (isEmpty(data)) {
    throw new LeemonsError(ctx, { message: 'No changes detected' });
  }

  // const { id, ...assetData } = prepareAssetData({ data });
  const { id, ...assetData } = data;
  assetData.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  let assetId = id;

  await validateAddAsset(assetData);

  // ·········································································
  // CHECK PERMISSIONS

  // EN: Get user's permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions({ assetId, ctx });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.edit) {
    throw new LeemonsError(ctx, {
      message: "You don't have permissions to update this asset",
      httpStatusCode: 401,
    });
  }

  // ·········································································
  // DATA DIFFERENCE

  // EN: Get the current values
  // ES: Obtenemos los valores actuales
  const currentAsset = (await getByIds({ ids: assetId, withFiles: true, ctx }))[0];

  if (!currentAsset) {
    throw new LeemonsError(ctx, {
      message: 'Asset not found',
      httpStatusCode: 422,
    });
  }

  // If the new subjects are strings, we pick the current subjects ids
  if (assetData.subjects && typeof assetData.subjects[0] === 'string') {
    currentAsset.subjects = currentAsset.subjects?.map((subject) => subject.subject ?? subject);
  }

  const { updateProperties, newData, diff } = await handleUpdateObject({
    currentAsset,
    assetData,
    ctx,
  });
  const { subjects, ...updateObject } = updateProperties;

  // ·········································································
  // DUPLICATE ASSET

  const currentVersion = await ctx.tx.call('common.versionControl.getVersion', {
    id: assetId,
  });

  // ES: Si la versión actual es la publicada, hacemos el upgrade
  // EN: If the current version is the published one, we upgrade
  if (upgrade && currentVersion.published) {
    const duplicatedAsset = await handleAssetUpgrade({
      assetId,
      scale,
      published,
      permissions,
      ctx,
    });
    currentVersion.published = published;
    assetId = duplicatedAsset.id;
    currentAsset.id = assetId;

    if (!diff.length) {
      return currentAsset;
    }
  }

  // EN: If the asset is not published and we want to publish it, we do it
  // ES: Si el activo no está publicado y queremos publicarlo, lo hacemos
  if (published && !currentVersion.published) {
    await ctx.tx.call('common.versionControl.publishVersion', {
      id: assetId,
      publish: published,
    });
  }

  if (!diff.length) {
    return currentAsset;
  }

  await handleSubjectsUpdates({ assetId, subjects, diff, ctx });

  // ·········································································
  // HANDLE TAGS

  if (diff.includes('tags')) {
    handleTagsUpdates({ assetId, updateObject, ctx });
  }

  // ·········································································
  // HANDLE FILES

  const fileNeedsUpdate = diff.includes('file');
  const coverNeedsUpdate = diff.includes('cover');

  const { newFile, coverFile, toUpdate, filesToRemove } = await handleFileAndCoverUpdates({
    assetId,
    assetData,
    updateObject,
    currentAsset,
    fileNeedsUpdate,
    coverNeedsUpdate,
    ctx,
  });

  // Removes the old files
  await handleFilesRemoval({
    assetId: id,
    assetData,
    filesToRemove,
    fileNeedsUpdate,
    coverNeedsUpdate,
    ctx,
  });

  // ·········································································
  // UPDATE ASSET DATA

  // EN: Update the asset
  // ES: Actualizar el asset
  const asset = await ctx.tx.db.Assets.findOneAndUpdate({ id: assetId }, toUpdate, { lean: true });

  return { ...asset, subjects, file: newFile, cover: coverFile, tags: newData.tags };
}

module.exports = { update };
