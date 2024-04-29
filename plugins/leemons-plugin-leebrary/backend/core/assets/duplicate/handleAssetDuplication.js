const _ = require('lodash');
const { isTruthy } = require('../../shared');
const { add } = require('../add');

/**
 * Handles the creation of a new asset during the duplication process.
 * It prepares the asset data, determines the indexable and public status, and calls the add function to create the new asset.
 *
 * @summary Creates a new asset during the duplication process.
 * @param {Object} params - An object containing the parameters
 * @param {Object} params.asset - The original asset object
 * @param {Array} params.tags - An array of tags associated with the asset
 * @param {string} params.newId - The ID for the new asset
 * @param {boolean} params.preserveName - A flag indicating whether to preserve the original asset name
 * @param {Array} params.permissions - An array of permissions associated with the asset
 * @param {boolean} params.isIndexable - A flag indicating whether the asset is indexable
 * @param {boolean} params.isPublic - A flag indicating whether the asset is public
 * @param {MoleculerContext} params.ctx - The Moleculer ctx
 * @returns {Promise<Object>} - Returns a promise with the newly created asset
 */
async function handleAssetDuplication({
  asset,
  tags,
  newId,
  preserveName,
  permissions,
  isIndexable,
  isPublic,
  ctx,
}) {
  const assetData = _.omit(asset, [
    '_id',
    'id',
    'file',
    'cover',
    'icon',
    'category',
    'fromUser',
    'fromUserAgent',
    'created_at',
    'updated_at',
    'createdAt',
    'updatedAt',
  ]);
  const _isIndexable = isIndexable === undefined ? asset.indexable : isTruthy(isIndexable);
  const _isPublic = isPublic === undefined ? asset.public : isTruthy(isPublic);

  return add({
    asset: {
      ...assetData,
      tags,
      name: isTruthy(preserveName) ? asset.name : `${asset.name} (1)`,
      categoryId: asset.category,
      permissions,
      indexable: _isIndexable,
      public: _isPublic,
    },
    permissions,
    newId,
    duplicating: true,
    ctx,
  });
}

module.exports = { handleAssetDuplication };
