const {
  compact,
  uniq,
  uniqBy,
  flattenDeep,
  isEmpty,
  sortBy,
  intersection,
  groupBy,
  isArray,
  forEach,
  find,
  set,
  map,
  isObject,
  difference,
  keyBy,
} = require('lodash');
const semver = require('semver');
const { getByIds } = require('../assets/getByIds');
const { getIndexables } = require('../assets/getIndexables');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getAssetsByType } = require('../files/getAssetsByType');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { getByUser: getPinsByUser } = require('../pins/getByUser');
const { byProvider: getByProvider } = require('./byProvider');
const { tables } = require('../tables');
const { getAssetsByProgram } = require('../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../assets/getAssetsBySubject');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Prepares the provider query by adding program and subjects if they are not already present in the provider query.
 * @param {Object} providerQuery - The initial provider query.
 * @param {Array} programs - The programs to be added to the provider query.
 * @param {Array} subjects - The subjects to be added to the provider query.
 * @returns {Object} The updated provider query.
 */
function prepareProviderQuery({ providerQuery, programs, subjects }) {
  if (!providerQuery?.program && programs) {
    providerQuery.program = programs[0];
  }
  if (!providerQuery?.subjects && subjects) {
    providerQuery.subjects = subjects;
  }

  return providerQuery;
}

/**
 * Processes the category ID. If the category is an ID, it fetches the category by ID. If not, it fetches the category by key.
 * @param {Object} params - The parameters for processing the category ID.
 * @param {string} params.category - The category to be processed.
 * @param {Object} params.transacting - The transaction object.
 * @returns {string} The ID of the category.
 */
async function processCategoryId({ category, transacting }) {
  let result;
  let isId = category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  if (isId) {
    result = await getCategoryById(category, { columns: ['id'], transacting });
  } else {
    result = await getCategoryByKey(category, { columns: ['id'], transacting });
  }

  return result.id;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Searches for assets based on various criteria.
 * @async
 * @param {Object} params - The parameters for the search.
 * @param {string} params.criteria - The search criteria.
 * @param {string} params.type - The type of asset to search for.
 * @param {string} params.category - The category of the asset to search for.
 * @param {Object} options - The options for the search.
 * @param {boolean} options.allVersions - Whether to include all versions of the asset.
 * @param {string} options.sortBy - The field to sort the results by.
 * @param {string} options.sortDirection - The direction to sort the results in.
 * @param {boolean} options.published - Whether to only include published assets.
 * @param {boolean} options.indexable - Whether to only include indexable assets.
 * @param {boolean} options.preferCurrent - Whether to prefer the current version of the asset.
 * @param {boolean} options.searchInProvider - Whether to search in the provider.
 * @param {Object} options.providerQuery - The query to use when searching in the provider.
 * @param {boolean} options.pinned - Whether to only include pinned assets.
 * @param {boolean} options.showPublic - Whether to only include public assets.
 * @param {Array} options.roles - The roles to include in the search.
 * @param {boolean} options.onlyShared - Whether to only include shared assets.
 * @param {Array} options.programs - The programs to include in the search.
 * @param {Array} options.subjects - The subjects to include in the search.
 * @param {Object} options.userSession - The user session.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The search results.
 */
async function search(
  { criteria = '', type, category },
  {
    allVersions = false,
    sortBy: sortingBy,
    sortDirection = 'asc',
    published = true,
    indexable = true,
    preferCurrent,
    searchInProvider,
    providerQuery = {},
    pinned,
    showPublic,
    roles,
    onlyShared,
    programs: _programs,
    subjects: _subjects,
    userSession,
    transacting,
  } = {}
) {
  let programs = _programs;
  let subjects = _subjects;

  if (!isObject(providerQuery)) {
    providerQuery = {};
  }

  if (!programs && providerQuery?.program) {
    programs = [providerQuery.program];
  }
  if (!subjects && providerQuery?.subjects) {
    subjects = providerQuery.subjects;
  }

  providerQuery = prepareProviderQuery({ providerQuery, programs, subjects });

  let assets = [];
  let nothingFound = false;

  if (pinned) {
    // eslint-disable-next-line no-param-reassign
    published = 'all';
    // eslint-disable-next-line no-param-reassign
    preferCurrent = false;
  }

  try {

    // ·································
    // BY CATEGORY

    let categoryId;
    if (category) {
      categoryId = await processCategoryId({ category, transacting });
    }

    // ·································
    // BY PINS

    if (pinned) {
      const pins = await getPinsByUser({ userSession, transacting });
      nothingFound = false;
      if (isArray(pins)) {
        assets = pins.map((pin) => pin.asset);
      } else {
        nothingFound = assets.length === 0;
      }
    }

    // ·································
    // BY PROVIDER

    let providerAssets = null;
    if (searchInProvider && categoryId && !isEmpty(criteria)) {
      providerAssets = await getByProvider(categoryId, criteria, {
        query: providerQuery,
        assets,
        published,
        preferCurrent,
        userSession,
        transacting,
      });

      nothingFound = !providerAssets?.length;
    }

    if (!providerAssets || providerAssets.length) {
      const query = {
        indexable,
      };
      if (criteria) {
        query.$or = [
          { name_$contains: criteria },
          { tagline_$contains: criteria },
          { description_$contains: criteria },
        ];
      }

      const assetIds = providerAssets || assets;
      if (!isEmpty(assetIds) || pinned) {
        query.id_$in = assetIds;
      }

      if (categoryId) {
        query.category = categoryId;
      }

      // ·································
      // BY TAGS

      const tagsService = leemons.getPlugin('common').services.tags;
      const [assetsFound, byTags] = await Promise.all([
        tables.assets.find(query, { columns: ['id'], transacting }),
        tagsService.getTagsValueByPartialTags(criteria, {
          type: leemons.plugin.prefixPN(''),
          transacting,
        }),
      ]);

      const matches = map(assetsFound, 'id');

      // ES: Si existen recursos, se debe a un filtro previo que debemos aplicar como intersección
      // EN: If there are resources, we must apply a previous filter as an intersection
      if (isEmpty(criteria)) {
        assets = matches;
      } else if (!isEmpty(assets)) {
        assets = intersection(matches, compact(uniq(flattenDeep(byTags))));
      } else {
        assets = compact(uniq(matches.concat(flattenDeep(byTags))));
      }

      nothingFound = assets.length === 0;
    }


    // ·································
    // BY SHARED

    if (!onlyShared) {
      if (type) {
        assets = await getAssetsByType(type, { assets, transacting });
        nothingFound = assets.length === 0;
      }

      if (programs) {
        assets = await getAssetsByProgram(programs, { assets, transacting });
        nothingFound = assets.length === 0;
      }

      if (subjects) {
        assets = await getAssetsBySubject(subjects, { assets, transacting });
        nothingFound = assets.length === 0;
      }

      if (indexable && assets && assets.length) {
        assets = await getIndexables(assets, { columns: ['id'], transacting });
        assets = map(assets, 'id');
        nothingFound = assets.length === 0;
      }
    } else {
      const sysName = await leemons
        .getPlugin('users')
        .services.profiles.getProfileSysName(userSession, { transacting });
      if (sysName === 'student') {
        const assetsToRemove = await getAssetsBySubject([], { assets, transacting });
        assets = difference(assets, assetsToRemove);
      }
    }

    // ·································
    // BY PERMISSIONS

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    let assetsWithPermissions = [];
    if (!nothingFound) {
      assetsWithPermissions = await getPermissions(uniq(assets), {
        showPublic,
        userSession,
        onlyShared,
        transacting,
      });
      assets = assetsWithPermissions;
      nothingFound = assets.length === 0;
    }

    // ·································
    // BY STATUS

    // EN: Filter by published status
    // ES: Filtrar por estado publicado
    if (!nothingFound) {
      const { versionControl } = leemons.getPlugin('common').services;
      assets = await versionControl.getVersion(map(assets, 'asset'), { transacting });
      if (published !== 'all') {
        assets = assets.filter(({ published: isPublished }) => isPublished === published);
      }

      // EN: Filter by preferCurrent status
      // ES: Filtrar por estado preferCurrent
      const groupedAssets = groupBy(assets, (id) => id.uuid);

      // TODO: Hay que ver cómo montar esto bien
      /*
      if (published !== false && preferCurrent) {
        const assetsUuids = uniq(assets.map((id) => id.uuid));

        const currentVersions = await Promise.all(
          assetsUuids.map(async (uuid) => {
            const { current } = await versionControl.getCurrentVersions(uuid, { transacting });

            return { uuid, current: versionControl.stringifyId(uuid, current) };
          })
        );

        // EN: Get only the current versions (if not present, return all)
        // ES: Obtener solo las versiones actuales
        forEach(groupedAssets, (values, uuid) => {
          const currentVersion = find(currentVersions, (version) => version.uuid === uuid);

          const current = find(values, (id) => id.fullId === currentVersion.current);
          if (current) {
            set(groupedAssets, uuid, [current]);
          }

          return values;
        });

        // EN: Get the latest versions of each uuid
        // ES: Obtener la última versión de cada uuid
        assets = map(groupedAssets, (values) => {
          const versions = map(values, (id) => id.version);

          const latest = semver.maxSatisfying(versions, '*');

          return find(values, (id) => id.version === latest).fullId;
        });
      } else
      */

      if (preferCurrent) {
        // EN: Get the latest versions of each uuid
        // ES: Obtener la última versión de cada uuid
        assets = map(groupedAssets, (values) => {
          const versions = map(values, (id) => id.version);

          const latest = semver.maxSatisfying(versions, '*');

          return find(values, (id) => id.version === latest).fullId;
        });
      } else {
        assets = assets.map(({ fullId }) => fullId);
      }

      assets = assetsWithPermissions.filter(({ asset, role, ...others }) => {
        if (roles?.length && !roles.includes(role)) {
          return false;
        }

        return assets.includes(asset);
      });
    }

    let result = uniqBy(assets, 'asset') || [];

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic

    if (sortingBy && !isEmpty(sortingBy)) {
      const [items] = await Promise.all([
        getByIds(map(result, 'asset'), {
          withCategory: false,
          withTags: false,
          indexable,
          showPublic,
          userSession,
          transacting,
        }),
      ]);

      let sortedAssets = sortBy(items, sortingBy);

      if (sortDirection === 'desc') {
        sortedAssets = sortedAssets.reverse();
      }

      const assetIds = sortedAssets.map((item) => item.id);
      const _result = [];
      const resultByAsset = keyBy(result, 'asset');
      forEach(assetIds, (assetId) => {
        if (resultByAsset[assetId]) {
          _result.push(resultByAsset[assetId]);
        }
      });
      result = _result;
    }

    return result;
  } catch (e) {
    console.log(e);
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
