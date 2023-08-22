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
  uniqBy,
  filter,
  forEach,
  groupBy,
} = require('lodash');
const {
  getUserAgentsInfo,
} = require('leemons-plugin-users/src/services/user-agents/getUserAgentsInfo');
const { tables } = require('../tables');
const { CATEGORIES } = require('../../../config/constants');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { find: findBookmarks } = require('../bookmarks/find');
const { getByIds: getCategories } = require('../categories/getByIds');
const { getByAssets: getPins } = require('../pins/getByAssets');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');
const { getClassesPermissions } = require('../permissions/getClassesPermissions');
const canUnassignRole = require('../permissions/helpers/canUnassignRole');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches permissions for each asset and checks if the user can edit permissions
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch permissions for
 * @param {object} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array containing permissions by asset and canEditPermissions
 */
async function getUserPermissionsByAsset({ assets, userSession, transacting }) {
  const { services: userService } = leemons.getPlugin('users');
  let canEditPermissions = [];

  const permissionTypes = ['asset.can-view', 'asset.can-edit', 'asset.can-assign'];
  const permissionsPromises = permissionTypes.map(type =>
    userService.permissions.getItemPermissions(
      map(assets, 'id'),
      leemons.plugin.prefixPN(type),
      { transacting, returnRaw: true }
    )
  );

  const [viewPermissions, editPermissions, assignPermissions] = await Promise.all(permissionsPromises);
  const currentPermissions = [...viewPermissions, ...editPermissions, ...assignPermissions];

  if (userSession) {
    canEditPermissions = await userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
      userSession.userAgents,
      leemons.plugin.prefixPN('asset.can-edit'),
      { ignoreOriginalTarget: true, item: map(assets, 'id'), transacting }
    );
  }

  const permissionsByAsset = {};
  forEach(currentPermissions, (permission) => {
    if (!permissionsByAsset[permission.item]) {
      permissionsByAsset[permission.item] = {
        viewer: [],
        editor: [],
        assigner: [],
      };
    }
    let role = 'viewer';
    if (permission.type.includes('can-edit')) {
      role = 'editor';
    } else if (permission.type.includes('can-assign')) {
      role = 'assigner';
    }
    permissionsByAsset[permission.item][role].push(permission.permissionName);
  });

  return [permissionsByAsset, canEditPermissions];
}

/**
 * Fetches assets with permissions
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch permissions for
 * @param {Array} params.assetsIds - The IDs of the assets
 * @param {boolean} params.showPublic - Flag to show public assets
 * @param {object} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of assets with permissions
 */
async function getAssetsWithPermissions({ assets, assetsIds, showPublic, userSession, transacting }) {
  const classesPermissionsPerAsset = await getClassesPermissions(map(assets, 'id'), {
    withInfo: true,
    transacting,
    userSession,
  });

  let permissions = [];

  if (userSession || showPublic) {
    permissions = await getPermissions(assetsIds, { showPublic, userSession, transacting });
  }

  const privateAssets = permissions.map((item) => item.asset);
  assets = assets.filter((asset) => privateAssets.includes(asset.id));

  const getUsersAssetIds = assets
    .filter((asset) => {
      const classesWithPermissions = classesPermissionsPerAsset.find((item) => item.asset === asset.id);
      asset.isPrivate = !classesWithPermissions.length;
      asset.classesCanAccess = classesWithPermissions;
      const permission = permissions.find((item) => item.asset === asset.id);
      return !isEmpty(permission?.permissions);
    })
    .map((asset) => asset.id);

  if (getUsersAssetIds.length) {
    const { services } = leemons.getPlugin('users');
    const rawUserAgents = await services.permissions.findUsersWithPermissions(
      {
        permissionName_$in: map(getUsersAssetIds, getAssetPermissionName),
      },
      { returnRaw: true, transacting }
    );
    const userAgentsById = keyBy(await getUserAgentsInfo(uniq(map(rawUserAgents, 'userAgent')), { transacting }), 'id');

    assets = assets.map((asset) => {
      if (getUsersAssetIds.includes(asset.id)) {
        const permission = permissions.find((item) => item.asset === asset.id);
        const assetPermissionName = getAssetPermissionName(asset.id);
        const { role: userRole } = permission;
        const rawPerm = filter(
          rawUserAgents,
          ({ permissionName }) => permissionName === assetPermissionName
        );
        const assetUserAgents = uniqBy(rawPerm, 'userAgent');

        let assetPermissions = [];
        forEach(assetUserAgents, (raw) => {
          const userAgent = userAgentsById[raw.userAgent];
          const perm = find(assetPermissions, { id: userAgent.user.id });
          if (perm) {
            perm.userAgentIds.push(userAgent.id);
            perm.permissions.push(raw.actionName);
          } else {
            assetPermissions.push({
              ...userAgent.user,
              userAgentIds: [userAgent.id],
              permissions: [raw.actionName],
            });
          }
        });
        assetPermissions = assetPermissions.map((user) => {
          const item = { ...user };
          item.editable = canUnassignRole(userRole, item.permissions[0]);
          return item;
        });
        asset.canAccess = assetPermissions;
        if (asset.canAccess?.length) {
          const noOwners = filter(
            asset.canAccess,
            (item) => !item.permissions?.includes('owner')
          );
          if (noOwners.length) {
            asset.isPrivate = false;
          }
        }

        const _permission = permissions.find((item) => item.asset === asset.id);
        if (!isEmpty(_permission?.permissions)) {
          const { permissions: userPermissions } = _permission;
          if (!userPermissions.edit) {
            const owner = find(asset.canAccess, (item) =>
              item.permissions?.includes('owner')
            );
            asset.canAccess = null;
            if (owner) {
              asset.canAccess = [owner];
            }
          }
        }
      }
      return asset;
    });
  }

  return assets;
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
  const fileIds = compact(uniq(map(assetsFiles, 'file').concat(assets.map((asset) => asset.cover))));

  const bookmarks = await findBookmarks({ asset_$in: assetsIds }, { transacting });
  fileIds.push(...compact(uniq(map(bookmarks, 'icon'))));

  const files = await tables.files.find({ id_$in: fileIds }, { transacting });
  const filesById = keyBy(files, 'id');

  return assets.map((asset) => {
    const assetFiles = assetsFiles.filter((assetFile) => assetFile.asset === asset.id);
    const bookmark = find(bookmarks, { asset: asset.id });

    asset.files = assetFiles.map((assetFile) => filesById[assetFile.file]);
    asset.cover = filesById[asset.cover];

    if (bookmark) {
      asset.url = bookmark.url;
      asset.icon = filesById[bookmark.icon];
      asset.fileType = 'bookmark';
      asset.metadata = [];
    }

    if (asset.cover) {
      asset.file = asset.files.length > 1 ? asset.files.filter((file) => file.id !== asset.cover.id) : asset.files[0];
    }

    return asset;
  });
}

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
  const assetsSubjects = await tables.assetsSubjects.find({ asset_$in: assetsIds }, { transacting });
  const subjectsByAsset = groupBy(assetsSubjects, 'asset');

  return assets.map((asset) => ({
    ...asset,
    subjects: subjectsByAsset[asset.id],
  }));
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
    assets.map((asset) =>
      tagsService.getValuesTags(asset.id, { type: leemons.plugin.prefixPN(''), transacting })
    )
  );

  return tags;
}

/**
 * Fetches category data associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch category data for
 * @param {object} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of categories and asset category data
 */
async function getAssetsCategoryData({ assets, userSession, transacting }) {
  const categoryIds = uniq(assets.map((item) => item.category));
  const categories = await getCategories(categoryIds, { transacting });

  const results = await Promise.all(
    categories.map(async (category) => {
      if (category.provider !== 'leebrary') {
        const assetProviderService = leemons.getProvider(category.provider).services.assets;
        const filteredAssets = assets
          .filter((item) => item.category === category.id)
          .map((item) => ({ ...item, category }));

        return await assetProviderService.getByIds(filteredAssets, { userSession, transacting });
      }
      return null;
    })
  );

  const assetCategoryData = results.flat();

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
  const programIds = assets.filter(asset => asset.program).map(asset => asset.program);

  if (!programIds.length) {
    return {};
  }

  const programs = await leemons
    .getPlugin('academic-portfolio')
    .services.programs.programsByIds(uniq(programIds), {
      onlyProgram: true,
      transacting,
    });

  return keyBy(programs, 'id');
}

/**
 * Processes the final asset by adding additional properties based on permissions, categories, tags, and pins.
 * @async
 * @param {Object} params - The params object
 * @param {Object} params.asset - The asset to process
 * @param {Array} params.userAgents - The user agents associated with the user session
 * @param {Object} params.programsById - The programs aggregated by ID
 * @param {Object} params.permissionsByAsset - The permissions aggregated by asset
 * @param {boolean} params.withCategory - Flag to include category in the response
 * @param {Array} params.categories - The categories associated with the assets
 * @param {Array} params.assetCategoryData - The category data associated with the assets
 * @param {boolean} params.withTags - Flag to include tags in the response
 * @param {Array} params.tags - The tags associated with the assets
 * @param {boolean} params.checkPins - Flag to check pins
 * @param {Array} params.pins - The pins associated with the assets
 * @param {Array} params.canEditPermissions - The permissions that the user can edit
 * @returns {Promise<Object>} - Returns the processed asset with additional properties
 */
async function processFinalAsset({ asset, userAgents, programsById, permissionsByAsset, withCategory, categories, assetCategoryData, withTags, tags, checkPins, pins, canEditPermissions }) {
  const roles = {
    delete: ['owner'],
    share: ['owner', 'editor'],
    edit: ['owner', 'editor'],
    assign: ['owner', 'editor', 'assigner'],
  };

  const item = { ...asset };

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
    Object.keys(roles).forEach(role => {
      item[`${role}able`] = item.canAccess.some(permission =>
        intersection(permission.permissions, roles[role]).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
      );
    });

    item.role = ['viewer', 'editor', 'owner'].find(role =>
      item.canAccess.some(permission =>
        intersection(permission.permissions, [role]).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
      )
    );
  }

  if (canEditPermissions.includes(item.id) && item.role !== 'owner') {
    item.role = 'editor';
    Object.keys(roles).forEach(role => {
      item[`${role}able`] = roles[role].includes('editor');
    });
  }

  return item;
}

/**
 * Builds a query object based on the provided asset IDs and indexable flag.
 * @param {Object} params - The params object
 * @param {Array<string>} params.assetsIds - The IDs of the assets to include in the query.
 * @param {boolean} params.indexable - Flag to filter assets based on their indexable property.
 * @returns {Object} - Returns a query object.
 */
function buildQuery({ assetsIds, indexable }) {
  const query = {
    id_$in: assetsIds,
  };

  if (!isNil(indexable)) {
    query.indexable = indexable;
  }

  return query;
}

// ------------------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetch assets by their IDs
 * @async
 * @param {Array} assetsIds - The IDs of the assets to fetch
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
async function getByIds(
  ids,
  {
    withFiles,
    withSubjects = true,
    withTags = true,
    withCategory = true,
    checkPins = true,
    checkPermissions,
    indexable,
    userSession,
    showPublic,
    transacting,
  } = {}
) {
  const assetsIds = flatten([ids]);
  const query = buildQuery({ assetsIds, indexable });

  let assets = await tables.assets.find(query, { transacting });

  // ··········································
  // PERMISSIONS & PERSONS

  const [permissionsByAsset, canEditPermissions] = await getUserPermissionsByAsset({ assets, userSession, transacting });

  if (checkPermissions && userSession) {
    assets = await getAssetsWithPermissions({ assets, assetsIds, showPublic, userSession, transacting });
  }

  // ··········································
  // SUBJECTS

  if (!isEmpty(assets) && withSubjects) {
    assets = await getAssetsWithSubjects({ assets, assetsIds, transacting });
  }

  // ··········································
  // FILES

  if (!isEmpty(assets) && withFiles) {
    assets = await getAssetsWithFiles({ assets, assetsIds, transacting });
  }

  // ··········································
  // TAGS

  let tags = [];
  if (withTags) {
    tags = await getAssetsTags({ assets, transacting });
  }

  // ··········································
  // CATEGORY DATA

  let categories = [];
  let assetCategoryData = [];
  if (withCategory) {
    [categories, assetCategoryData] = await getAssetsCategoryData({ assets, userSession, transacting });
  }

  // ··········································
  // PINS DATA
  let pins = [];

  if (checkPins) {
    pins = await getPins(assetsIds, { userSession, transacting });
  }

  // ··········································
  // FINALLY

  const programsById = await getAssetsProgramsAggregatedById({ assets, transacting });
  const userAgents = userSession?.userAgents.map(({ id }) => id) || [];

  const finalAssets = assets.map((asset, index) => {
    return processFinalAsset({ asset, userAgents, programsById, permissionsByAsset, withCategory, categories, assetCategoryData, withTags, tags: tags[index], checkPins, pins, canEditPermissions })
  });

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
