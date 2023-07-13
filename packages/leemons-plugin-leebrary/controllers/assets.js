const { isEmpty, isString } = require('lodash');
const { CATEGORIES } = require('../config/constants');
const { add } = require('../src/services/assets/add');
const { update } = require('../src/services/assets/update');
const { duplicate } = require('../src/services/assets/duplicate');
const { remove } = require('../src/services/assets/remove');
const { getByUser } = require('../src/services/assets/getByUser');
const { search: getByCriteria } = require('../src/services/search');
const { getByCategory } = require('../src/services/permissions/getByCategory');
const { getByIds } = require('../src/services/assets/getByIds');
const { getByAsset: getPermissions } = require('../src/services/permissions/getByAsset');
const { getUsersByAsset } = require('../src/services/permissions/getUsersByAsset');
const canAssignRole = require('../src/services/permissions/helpers/canAssignRole');
const { getById: getCategory } = require('../src/services/categories/getById');
const { add: addPin } = require('../src/services/pins/add');
const { removeByAsset: removePin } = require('../src/services/pins/removeByAsset');
const { getByUser: getPinsByUser } = require('../src/services/pins/getByUser');

async function setAsset(ctx) {
  const { id } = ctx.params;
  const { categoryId, tags, file: assetFile, cover: assetCover, ...assetData } = ctx.request.body;
  const filesData = ctx.request.files;
  const { userSession } = ctx.state;

  Object.keys(assetData).forEach((key) => {
    if (assetData[key] === 'null') {
      assetData[key] = null;
    }
  });

  if (isEmpty(categoryId)) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  const category = await getCategory(categoryId);

  let file;
  let cover;

  // Media files
  if (category.key === CATEGORIES.MEDIA_FILES) {
    if (!filesData && !assetFile) {
      throw new global.utils.HttpError(400, 'No file was uploaded');
    }

    if (filesData?.files) {
      const files = filesData.files.length ? filesData.files : [filesData.files];

      if (files.length > 1) {
        throw new global.utils.HttpError(501, 'Multiple file uploading is not enabled yet');
      }

      [file] = files;
    } else {
      file = assetFile;
    }

    cover = filesData?.cover || filesData?.coverFile || assetCover || assetData.coverFile;
  }
  // Bookmarks
  else if (category.key === CATEGORIES.BOOKMARKS) {
    cover = assetCover || filesData?.cover || filesData?.coverFile || assetData.coverFile;
  }

  // ES: Preparamos las Tags en caso de que lleguen como string
  // EN: Prepare the tags in case they come as string
  let tagValues = tags || [];

  if (isString(tagValues)) {
    tagValues = tagValues.split(',');
  }

  let asset;

  if (assetData.subjects) {
    assetData.subjects = JSON.parse(assetData.subjects);
  }

  if (id) {
    asset = await update.call(
      { calledFrom: leemons.plugin.prefixPN('') },
      { ...assetData, id, category, categoryId, cover, file, tags: tagValues },
      { userSession }
    );
  } else {
    asset = await add.call(
      { calledFrom: leemons.plugin.prefixPN('') },
      { ...assetData, category, categoryId, cover, file, tags: tagValues },
      { userSession }
    );
  }

  const { role } = await getPermissions(asset.id, { userSession });

  let assetPermissions = await getUsersByAsset(asset.id, { userSession });
  assetPermissions = assetPermissions.map((user) => {
    const item = { ...user };
    item.editable = canAssignRole(role, item.permissions[0], item.permissions[0]);
    return item;
  });

  ctx.status = 200;
  ctx.body = { status: 200, asset: { ...asset, canAccess: assetPermissions } };
}

async function removeAsset(ctx) {
  const { id } = ctx.params;
  const { userSession } = ctx.state;

  const deleted = await remove(id, { userSession });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    deleted,
  };
}

async function duplicateAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;
  const { preserveName, indexable, public: isPublic } = ctx.request.body;

  const asset = await duplicate.call({ calledFrom: leemons.plugin.prefixPN('') }, assetId, {
    preserveName,
    indexable,
    public: isPublic,
    userSession,
  });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset,
  };
}

async function getAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;

  const [asset] = await getByIds(assetId, { withFiles: true, checkPermissions: true, userSession });

  if (!asset) {
    throw new global.utils.HttpError(400, 'Asset not found');
  }

  const { role: assignerRole, permissions } = await getPermissions(assetId, { userSession });

  if (!permissions?.view) {
    throw new global.utils.HttpError(401, 'Unauthorized to view this asset');
  }

  let assetPermissions = false;

  if (permissions?.edit) {
    assetPermissions = await getUsersByAsset(assetId, { userSession });
    assetPermissions = assetPermissions.map((user) => {
      const item = { ...user };
      item.editable = canAssignRole(assignerRole, item.permissions[0], item.permissions[0]);
      return item;
    });
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset: { ...asset, canAccess: assetPermissions },
  };
}

async function getAssets(ctx) {
  const {
    category,
    criteria,
    type,
    published,
    preferCurrent,
    showPublic,
    searchInProvider,
    roles,
    providerQuery,
    programs,
    subjects,
    onlyShared,
  } = ctx.request.query;
  const { userSession } = ctx.state;

  /*
  if (isEmpty(category)) {
    throw new global.utils.HttpError(400, 'Not category was specified');
  }
  */

  const trueValues = ['true', true, '1', 1];

  let assets;
  const assetPublished = trueValues.includes(published);
  const displayPublic = trueValues.includes(showPublic);
  const searchProvider = trueValues.includes(searchInProvider);
  const _onlyShared = trueValues.includes(onlyShared);
  const parsedRoles = JSON.parse(roles || null) || [];
  const _providerQuery = JSON.parse(providerQuery || null);
  const _programs = JSON.parse(programs || null);
  const _subjects = JSON.parse(subjects || null);

  if (!isEmpty(criteria) || !isEmpty(type) || isEmpty(category)) {
    assets = await getByCriteria(
      { category, criteria, type },
      {
        indexable: true,
        published: assetPublished,
        showPublic: displayPublic,
        preferCurrent,
        userSession,
        roles: parsedRoles,
        searchInProvider: searchProvider,
        providerQuery: _providerQuery,
        programs: _programs,
        subjects: _subjects,
        onlyShared: _onlyShared,
        sortBy: 'updated_at',
        sortDirection: 'desc',
      }
    );
  } else {
    assets = await getByCategory(category, {
      published: assetPublished,
      indexable: true,
      preferCurrent,
      showPublic: displayPublic,
      userSession,
      roles: parsedRoles,
      searchInProvider: searchProvider,
      providerQuery: _providerQuery,
      programs: _programs,
      subjects: _subjects,
      onlyShared: _onlyShared,
      sortBy: 'updated_at',
      sortDirection: 'desc',
    });
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function getAssetsByIds(ctx) {
  const { userSession } = ctx.state;
  const {
    assets: assetIds,
    filters: { published, showPublic, indexable = true },
  } = ctx.request.body;

  if (isEmpty(assetIds)) {
    throw new global.utils.HttpError(400, 'Not assets was specified');
  }

  const assets = await getByIds(assetIds, {
    withFiles: true,
    checkPermissions: true,
    indexable,
    published,
    showPublic,
    userSession,
  });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function myAssets(ctx) {
  const { userSession } = ctx.state;
  const assets = await getByUser(userSession.id, { indexable: true });
  ctx.status = 200;
  ctx.body = { status: 200, assets };
}

// ························································
// METADATA

async function getUrlMetadata(ctx) {
  const { url } = ctx.request.query;
  if (isEmpty(url)) {
    throw new global.utils.HttpError(400, 'url is required');
  }
  let metas = {};
  try {
    const { body: html } = await global.utils.got(url);
    metas = await global.utils.metascraper({ html, url });
  } catch (e) {
    throw new Error(`Error getting URL metadata: ${url}`, { cause: e });
  }

  ctx.status = 200;
  ctx.body = { status: 200, metas };
}

// ························································
// PINS

async function addAssetPin(ctx) {
  const { asset: assetId } = ctx.request.body;
  const { userSession } = ctx.state;

  if (!assetId || isEmpty(assetId)) {
    throw new global.utils.HttpError(400, 'Asset id is required');
  }

  const pin = await addPin(assetId, { userSession });
  ctx.status = 200;
  ctx.body = { status: 200, pin };
}

async function removeAssetPin(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;

  const pin = await removePin(assetId, { userSession });
  ctx.status = 200;
  ctx.body = { status: 200, pin };
}

async function getPinnedAssets(ctx) {
  const { criteria, type, published, preferCurrent, showPublic, providerQuery } = ctx.request.query;
  const { userSession } = ctx.state;

  const _providerQuery = JSON.parse(providerQuery || null);
  const assetPublished = ['true', true, '1', 1].includes(published);
  const displayPublic = ['true', true, '1', 1].includes(showPublic);
  const _preferCurrent = ['true', true, '1', 1].includes(preferCurrent);

  const assets = await getByCriteria(
    { criteria, type },
    {
      pinned: true,
      indexable: true,
      published: assetPublished,
      showPublic: displayPublic,
      preferCurrent: _preferCurrent,
      providerQuery: _providerQuery,
      userSession,
    }
  );

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function hasPinnedAssets(ctx) {
  const { userSession } = ctx.state;

  const pins = await getPinsByUser({ userSession });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    hasPins: pins.length > 0,
  };
}

module.exports = {
  add: setAsset,
  update: setAsset,
  remove: removeAsset,
  duplicate: duplicateAsset,
  my: myAssets,
  get: getAsset,
  list: getAssets,
  listByIds: getAssetsByIds,
  urlMetadata: getUrlMetadata,
  addPin: addAssetPin,
  removePin: removeAssetPin,
  pins: getPinnedAssets,
  hasPins: hasPinnedAssets,
};
