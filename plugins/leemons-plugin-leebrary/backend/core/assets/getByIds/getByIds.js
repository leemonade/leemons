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
 * @param {object} options - The options object
 * @param {boolean} options.withFiles - Flag to include files in the response
 * @param {boolean} options.withSubjects - Flag to include subjects in the response (default: true)
 * @param {boolean} options.withTags - Flag to include tags in the response (default: true)
 * @param {boolean} options.withCategory - Flag to include category in the response (default: true)
 * @param {boolean} options.checkPins - Flag to check pins (default: true)
 * @param {boolean} options.checkPermissions - Flag to check permissions
 * @param {boolean} options.indexable - Flag to check if assets are indexable
 * @param {object} options.userSession - The user session object
 * @param {boolean} options.showPublic - Flag to show public assets
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of assets
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
} = {}) {
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
    pins = await getPins(assetsIds, { userSession, transacting });
  }

  // ·········································································
  // FINALLY

  const programsById = await getAssetsProgramsAggregatedById({ assets, ctx });
  const userAgents = userSession?.userAgents.map(({ id }) => id) || [];

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
/*
// return value:
[
  {
    id: '2739f390-efc5-44d7-97b3-10cd5f1abe93@1.0.0',
    name: 'Water',
    tagline: null,
    description: null,
    color: null,
    cover: null,
    fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
    fromUserAgent: '17d5407b-d043-483f-a9fd-61eb9ffe3dae',
    public: null,
    category: '13ce91bb-9135-49d9-9030-9d2559c74198',
    indexable: 1,
    center: null,
    program: 'edabdea5-d16f-4681-8753-f6740caaf342',
    deleted: 0,
    created_at: '2023-09-07T12:24:53.000Z',
    updated_at: '2023-09-07T12:24:53.000Z',
    deleted_at: null,
    subjects: [
      {
        id: '74a84ee3-3b1a-4f0c-9289-55ddef916bf2',
        asset: '2739f390-efc5-44d7-97b3-10cd5f1abe93@1.0.0',
        subject: 'db172925-237a-44a1-9dcf-4e4ceb7976cb',
        level: 'beginner',
        deleted: 0,
      },
    ],
    programName: 'High School',
    permissions: {
      viewer: [],
      editor: [],
    },
    duplicable: 1,
    assignable: undefined,
    downloadable: true,
    providerData: undefined,
    tags: [],
    pinned: false,
  },
];
*/
