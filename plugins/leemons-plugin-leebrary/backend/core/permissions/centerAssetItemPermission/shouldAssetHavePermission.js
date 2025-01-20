const { CATEGORIES } = require('../../../config/constants');
const { getById: getCategoryById } = require('../../categories/getById');

const CATEGORY_WITHOUT_STATUS_KEYS = [CATEGORIES.BOOKMARKS, CATEGORIES.MEDIA_FILES];
const statusCheck = ({ asset, isPublishing }) => isPublishing || !!asset?.providerData?.published;
const academicTagsCheck = ({ asset }) => asset.subjects?.length > 0;

/**
 * Determines if an asset should have the center asset permission based on its category.
 * Assets with publish/draft status must be published to have the permission.
 *
 * @param {Object} assetDetail - The asset details object.
 * @param {string} assetDetail.category.key - The key of the category.
 * @returns {boolean} True if the asset should have the permission, false otherwise.
 */

async function shouldAssetHavePermission({ assetDetail, isPublishing, ctx }) {
  const category = await getCategoryById({ id: assetDetail.category, ctx });

  if (CATEGORY_WITHOUT_STATUS_KEYS.includes(category.key)) {
    return academicTagsCheck({ asset: assetDetail });
  }
  return (
    statusCheck({ asset: assetDetail, isPublishing }) && academicTagsCheck({ asset: assetDetail })
  );
}

module.exports = { shouldAssetHavePermission };
