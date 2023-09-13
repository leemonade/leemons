/* eslint-disable no-param-reassign */
const {
  keyBy,
  isEmpty,
  flatten,
  map,
  find,
  compact,
  uniq,
  isNil,
  intersection,
  isArray,
  forEach,
  groupBy,
} = require('lodash');
const { CATEGORIES } = require('../../../config/constants');

const { find: findBookmarks } = require('../../bookmarks/find');
const { getByIds: getCategories } = require('../../categories/getByIds');
const { getByAssets: getPins } = require('../../pins/getByAssets');
const { buildQuery } = require('./buildQuery');
const { getUserPermissionsByAsset } = require('./getUserPermissionsByAsset');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches assets with their associated subjects
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch subjects for
 * @param {Array} params.assetsIds - The IDs of the assets
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of assets with their associated subjects
 */
async function getAssetsWithSubjects({ assets, assetsIds, transacting }) {
  const assetsSubjects = await tables.assetsSubjects.find(
    { asset_$in: assetsIds },
    { transacting }
  );

  const subjectsByAsset = groupBy(assetsSubjects, 'asset');

  return assets.map((asset) => {
    asset.subjects = subjectsByAsset[asset.id];
    return asset;
  });
}

/**
 * Fetches assets with files and bookmarks
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch files for
 * @param {Array} params.assetsIds - The IDs of the assets
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of assets with files and bookmarks
 */
async function getAssetsWithFiles({ assets, assetsIds, transacting }) {
  const assetsFiles = await tables.assetsFiles.find({ asset_$in: assetsIds }, { transacting });
  const fileIds = compact(
    uniq(map(assetsFiles, 'file').concat(assets.map((asset) => asset.cover)))
  );

  // ES: En caso de que algún asset sea un Bookmark, entonces recuperamos el icono
  // EN: In case one asset is a Bookmark, then we recover the icon
  const bookmarks = await findBookmarks({ asset_$in: assetsIds }, { transacting });
  const iconFiles = compact(uniq(map(bookmarks, 'icon')));
  fileIds.push(...iconFiles);

  const files = await tables.files.find({ id_$in: fileIds }, { transacting });

  return assets.map((asset) => {
    const items = assetsFiles
      .filter((assetFile) => assetFile.asset === asset.id)
      .map((assetFile) => find(files, { id: assetFile.file }));

    if (asset.cover) {
      asset.cover = find(files, { id: asset.cover });
    }

    const bookmark = find(bookmarks, { asset: asset.id });

    if (bookmark) {
      asset.url = bookmark.url;
      asset.icon = find(files, { id: bookmark.icon });
      asset.fileType = 'bookmark';
      asset.metadata = [];
    }

    if (!isEmpty(items)) {
      if (asset.cover) {
        asset.file = items.length > 1 ? items.filter((item) => item.id !== asset.cover) : items[0];
      } else {
        [asset.file] = items;
      }
    }

    return asset;
  });
}

/**
 * Fetches tags associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch tags for
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of tags associated with each asset
 */
async function getAssetsTags({ assets, transacting }) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const tags = await Promise.all(
    assets.map((item) =>
      tagsService.getValuesTags(item.id, { type: leemons.plugin.prefixPN(''), transacting })
    )
  );

  return tags;
}

/**
 * Fetches category data associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch category data for
 * @param {UserSession} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of categories and asset category data
 */
async function getAssetsCategoryData({ assets, userSession, transacting }) {
  const categoryIds = uniq(assets.map((item) => item.category));
  const categories = await getCategories(categoryIds, { transacting });

  // CATEGORY ROVIDER DATA
  const providersResults = await Promise.all(
    categories.map((category) => {
      if (category.provider === 'leebrary') {
        return null;
      }

      const categoryProvider = category.provider;
      const assetProviderService = leemons.getProvider(categoryProvider).services.assets;
      return assetProviderService.getByIds(
        assets
          .filter((item) => item.category === category.id)
          .map((item) => ({ ...item, category })),
        { userSession, transacting }
      );
    })
  );

  const assetCategoryData = providersResults.flat();

  return [categories, assetCategoryData];
}

/**
 * Fetches programs associated with each asset and aggregates them by ID
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch programs for
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Object>} - Returns an object with programs aggregated by ID
 */
async function getAssetsProgramsAggregatedById({ assets, transacting }) {
  let programsById = {};
  const programIds = [];
  forEach(assets, (asset) => {
    if (asset.program) {
      programIds.push(asset.program);
    }
  });

  if (programIds.length) {
    const programs = await leemons
      .getPlugin('academic-portfolio')
      .services.programs.programsByIds(uniq(programIds), {
        onlyProgram: true,
        transacting,
      });
    programsById = keyBy(programs, 'id');
  }

  return programsById;
}

/**
 * Processes the final asset by adding additional properties based on permissions, categories, tags, and pins.
 * @async
 * @param {Object} params - The params object
 * @param {Object} params.asset - The asset to process
 * @param {Object} params.programsById - The programs aggregated by ID
 * @param {Object} params.permissionsByAsset - The permissions aggregated by asset
 * @param {Array} params.canEditPermissions - The permissions that the user can edit
 * @param {boolean} params.withCategory - Flag to include category in the response
 * @param {Array} params.categories - The categories associated with the assets
 * @param {Array} params.assetCategoryData - The category data associated with the assets
 * @param {boolean} params.withTags - Flag to include tags in the response
 * @param {Array} params.tags - The tags associated with the assets
 * @param {boolean} params.checkPins - Flag to check pins
 * @param {Array} params.pins - The pins associated with the assets
 * @param {Array} params.userAgents - The user agents associated with the user session
 * @returns {Object} - Returns the processed asset with additional properties
 */
function processFinalAsset({
  asset,
  programsById,
  permissionsByAsset,
  canEditPermissions,
  withCategory,
  categories,
  assetCategoryData,
  withTags,
  tags,
  checkPins,
  pins,
  userAgents,
}) {
  const item = { ...asset };

  const deleteRoles = ['owner'];
  const shareRoles = ['owner', 'editor'];
  const editRoles = ['owner', 'editor'];
  const assignRoles = ['owner', 'editor', 'assigner'];

  if (item.program) {
    item.programName = programsById[item.program]?.name;
  }

  item.permissions = permissionsByAsset[item.id] || { viewer: [], editor: [] };

  if (withCategory) {
    const { key, duplicable, assignable } = find(categories, { id: asset.category });
    item.duplicable = duplicable;
    item.assignable = assignable;
    item.downloadable = key === CATEGORIES.MEDIA_FILES;
    item.providerData = find(assetCategoryData, { asset: asset.id });
  }

  if (withTags) {
    [item.tags] = tags;
  }

  if (checkPins) {
    const pin = find(pins, { asset: asset.id });
    item.pinned = !isNil(pin?.id);
  }

  if (isArray(item.canAccess)) {
    item.editable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, editRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.deleteable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, deleteRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.shareable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, shareRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.assignable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, assignRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.role = 'viewer';
    if (
      item.canAccess.some(
        (permission) =>
          intersection(permission.permissions, ['editor']).length > 0 &&
          intersection(permission.userAgentIds, userAgents).length > 0
      )
    ) {
      item.role = 'editor';
    }

    if (
      item.canAccess.some(
        (permission) =>
          intersection(permission.permissions, ['owner']).length > 0 &&
          intersection(permission.userAgentIds, userAgents).length > 0
      )
    ) {
      item.role = 'owner';
    }
  }

  if (canEditPermissions.includes(item.id)) {
    if (item.role !== 'owner') {
      item.role = 'editor';
      item.editable = editRoles.includes('editor');
      item.deleteable = deleteRoles.includes('editor');
      item.shareable = shareRoles.includes('editor');
      item.assignable = assignRoles.includes('editor');
    }
  }

  return item;
}

// ------------------------------------------------------------------------------------
// PUBLIC METHODS

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
    assets = await getAssetsWithSubjects({ assets, assetsIds, transacting });
  }

  // ·········································································
  // FILES
  if (!isEmpty(assets) && withFiles) {
    assets = await getAssetsWithFiles({ assets, assetsIds, transacting });
  }

  // ·········································································
  // TAGS

  let tags = [];
  if (withTags) {
    tags = await getAssetsTags({ assets, transacting });
  }

  // ·········································································
  // CATEGORY DATA

  let categories = [];
  let assetCategoryData = [];

  if (withCategory) {
    [categories, assetCategoryData] = await getAssetsCategoryData({
      assets,
      userSession,
      transacting,
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

  const programsById = await getAssetsProgramsAggregatedById({ assets, transacting });
  const userAgents = userSession?.userAgents.map(({ id }) => id) || [];

  const finalAssets = assets.map((asset, index) =>
    processFinalAsset({
      asset,
      programsById,
      permissionsByAsset,
      canEditPermissions,
      categories,
      withCategory,
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
