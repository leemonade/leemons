const { LeemonsError } = require('@leemons/error');

const QUESTION_STEM_RESOURCE_SUFFIX = ' - Question stem resource';

/**
 * Generates a standardized name for a stem resource asset.
 *
 * @param {string} sourceAssetName - The original name of the source asset. Defaults to 'media file asset'.
 * @param {number} maxLength - The maximum length allowed for the truncated asset name. Defaults to 45.
 * @returns {string} - The formatted asset name with the standard suffix appended.
 */
const getStemResouceAssetName = (sourceAssetName = 'media file asset', maxLength = 45) => {
  const assetName = sourceAssetName.replace(QUESTION_STEM_RESOURCE_SUFFIX, '');
  const truncatedName =
    assetName.length > maxLength ? `${assetName.substring(0, maxLength)}...` : assetName;
  return `${truncatedName}${QUESTION_STEM_RESOURCE_SUFFIX}`;
};

/**
 * Creates public and non-indexable asset for a question stem resource
 *
 * @param {object} params - The parameters for creating the stem resource asset
 * @param {object} params.sourceAsset - The source asset OBJECT to create the stem resource from
 * @param {string} params.sourceAsset.name - The name of the source asset
 * @param {object} params.sourceAsset.file - The file object of the source asset
 * @param {string} params.sourceAsset.file.id - The ID of the source asset's file
 * @param {boolean} params.published - Whether the asset should be published
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<string>} The ID of the created asset
 */

async function createStemResourceAsset({ sourceAsset, published, ctx }) {
  if (!sourceAsset) throw new LeemonsError(ctx, { message: 'Source asset is required' });

  const fileId = sourceAsset.file?.id || sourceAsset.cover?.id || sourceAsset; // For compatibility with old "question image" assets and bulkdata
  const asset = await ctx.tx.call('leebrary.assets.add', {
    asset: {
      name: getStemResouceAssetName(sourceAsset.name),
      indexable: false,
      public: true,
      file: fileId,
    },
    options: { published },
  });
  return asset.id;
}

module.exports = { createStemResourceAsset, getStemResouceAssetName };
