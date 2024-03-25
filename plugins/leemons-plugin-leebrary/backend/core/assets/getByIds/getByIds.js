/* eslint-disable no-param-reassign */
const { keyBy, isEmpty, flatten, forEach } = require('lodash');
const { getByAssets: getPins } = require('../../pins/getByAssets');
const { buildQuery } = require('./buildQuery');
const { getUserPermissionsByAsset } = require('./getUserPermissionsByAsset');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
const { getAssetsWithSubjects } = require('./getAssetsWithSubjects');
const { getAssetsWithFiles } = require('./getAssetsWithFiles');
const { getAssetsTags } = require('./getAssetsTags');
const { getAssetsCategoryData } = require('./getAssetsCategoryData');
const { getAssetsProgramsAggregatedById } = require('./getAssetsProgramsAggregatedById');
const { processFinalAsset } = require('./processFinalAsset');

/**
 * Fetch assets by their IDs
 * @async
 * @param {Array} ids - The IDs of the assets to fetch
 * @param {object} params - The options object
 * @param {boolean} [params.withFiles] - Flag to include files in the response
 * @param {boolean} [params.withSubjects] - Flag to include subjects in the response (default: true)
 * @param {boolean} [params.withTags] - Flag to include tags in the response (default: true)
 * @param {boolean} [params.withCategory] - Flag to include category in the response (default: true)
 * @param {boolean} [params.checkPins] - Flag to check pins (default: true)
 * @param {boolean} [params.checkPermissions] - Flag to check permissions
 * @param {boolean} [params.indexable]- Flag to check if assets are indexable
 * @param {boolean} [params.showPublic] - Flag to include public assets in the response
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<LibraryAsset>>} - Returns an array of assets
 */
async function getByIds({
  ids,
  withFiles,
  withSubjects = true,
  withTags = true,
  withCategory = true,
  checkPins = true,
  checkPermissions,
  indexable,
  showPublic,
  ctx,
}) {
  const assetsIds = flatten([ids]);
  const query = buildQuery({ assetsIds, indexable });

  let assets = await ctx.tx.db.Assets.find(query).lean();

  // ··········································
  // PERMISSIONS & PERSONS

  const [permissionsByAsset, canEditPermissions] = await getUserPermissionsByAsset({
    assets,
    ctx,
  });

  if (checkPermissions && ctx.meta.userSession) {
    assets = await getAssetsWithPermissions({
      assets,
      assetsIds,
      showPublic,
      ctx,
    });
  }

  // ·········································································
  // SUBJECT

  if (!isEmpty(assets) && withSubjects) {
    assets = await getAssetsWithSubjects({ assets, assetsIds, ctx });
  }

  // ·········································································
  // FILES
  if (!isEmpty(assets) && withFiles) {
    assets = await getAssetsWithFiles({ assets, assetsIds, ctx });
  }

  // ·········································································
  // TAGS

  let tags = [];
  if (withTags) {
    tags = await getAssetsTags({ assets, ctx });
  }

  // ·········································································
  // CATEGORY DATA

  let categories = [];
  let assetCategoryData = [];

  if (withCategory) {
    [categories, assetCategoryData] = await getAssetsCategoryData({
      assets,
      ctx,
    });
  }

  // ·········································································
  // PINS DATA

  let pins = [];

  if (checkPins) {
    pins = await getPins({ assetsIds, ctx });
  }

  // ·········································································
  // FINALLY

  const programsById = await getAssetsProgramsAggregatedById({ assets, ctx });
  const userAgents = ctx.meta.userSession?.userAgents?.map(({ id }) => id) || [];

  const finalAssets = assets.map((asset, index) =>
    processFinalAsset({
      asset,
      programsById,
      permissionsByAsset,
      canEditPermissions,
      withCategory,
      categories,
      assetCategoryData,
      withTags,
      tags: tags[index],
      checkPins,
      pins,
      userAgents,
    })
  );

  const finalAssetsAggregatedById = keyBy(finalAssets, 'id');

  const result = [];
  forEach(assetsIds, (assetId) => {
    if (finalAssetsAggregatedById[assetId]) {
      result.push(finalAssetsAggregatedById[assetId]);
    }
  });

  return result;
}

module.exports = { getByIds };
