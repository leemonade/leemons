const { omit } = require('lodash');

/**
 * This function creates a new asset in the database.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string} params.newId - The new ID for the asset. This is a unique identifier for the asset.
 * @param {string} params.categoryId - The ID of the category to which the asset belongs.
 * @param {string} params.coverId - The ID of the cover image for the asset.
 * @param {Object} params.assetData - An object containing the data for the asset. This includes information such as the asset's name, description, etc.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<LibraryAsset>} A promise that resolves with the created asset object.
 */
async function createAssetInDB({ newId, categoryId, coverId, assetData, ctx }) {
  const prepareNewAssetForDB = omit({ ...assetData }, [
    '_id',
    'id',
    'deploymentID',
    '__v',
    'isDeleted',
    'deletedAt',
    'createdAt',
    'updatedAt',
  ]);

  const assetDoc = await ctx.tx.db.Assets.create({
    ...prepareNewAssetForDB,
    id: newId,
    category: categoryId,
    cover: coverId,
  });
  return assetDoc.toObject();
}
module.exports = { createAssetInDB };
