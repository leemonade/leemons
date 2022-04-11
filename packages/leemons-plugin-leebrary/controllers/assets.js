const { isEmpty } = require('lodash');
const { CATEGORIES } = require('../config/constants');
const { add } = require('../src/services/assets/add');
const { update } = require('../src/services/assets/update');
const { remove } = require('../src/services/assets/remove');
const { getByUser } = require('../src/services/assets/getByUser');
const { getByCategory } = require('../src/services/permissions/getByCategory');
const { getByIds } = require('../src/services/assets/getByIds');
const { getByAsset: getPermissions } = require('../src/services/permissions/getByAsset');
const { getUsersByAsset } = require('../src/services/permissions/getUsersByAsset');
const canAssignRole = require('../src/services/permissions/helpers/canAssignRole');
const { getById: getCategory } = require('../src/services/categories/getById');

async function addAsset(ctx) {
  const { categoryId, ...assetData } = ctx.request.body;
  const filesData = ctx.request.files;
  const { userSession } = ctx.state;

  if (isEmpty(categoryId)) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  const category = await getCategory(categoryId);

  let file;
  let cover;

  // Media files
  if (category.key === CATEGORIES.MEDIA_FILES) {
    if (!filesData?.files) {
      throw new global.utils.HttpError(400, 'No file was uploaded');
    }

    const files = filesData.files.length ? filesData.files : [filesData.files];

    if (files.length > 1) {
      throw new global.utils.HttpError(501, 'Multiple file uploading is not enabled yet');
    }

    [file] = files;
    cover = filesData.coverFile;
  }
  // Bookmarks
  else if (category.key === CATEGORIES.BOOKMARKS) {
    cover = assetData.cover || filesData.coverFile;
  }

  const asset = await add({ ...assetData, category, categoryId, cover, file }, { userSession });

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

async function updateAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { id, ...assetData } = ctx.request.body;
  const { userSession } = ctx.state;

  const asset = await update(assetId, { ...assetData }, { userSession });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset,
  };
}

async function getAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;

  const [asset] = await getByIds(assetId, { withFiles: true });

  if (!asset) {
    throw new global.utils.HttpError(400, 'Asset not found');
  }

  const { role: assignerRole, permissions } = await getPermissions(assetId, { userSession });

  if (!permissions?.view) {
    throw new global.utils.HttpError(401, 'Unauthorized to view this asset');
  }

  let assetPermissions = false;

  if (assignerRole === 'owner') {
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
  const { category } = ctx.request.query;
  const { userSession } = ctx.state;

  if (isEmpty(category)) {
    throw new global.utils.HttpError(400, 'Not category was specified');
  }

  const assets = await getByCategory(category, { userSession });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function getAssetsByIds(ctx) {
  const { userSession } = ctx.state;
  const { assets: assetIds } = ctx.request.body;

  if (isEmpty(assetIds)) {
    throw new global.utils.HttpError(400, 'Not assets was specified');
  }

  const assets = await getByIds(assetIds, { withFiles: true, checkPermissions: true, userSession });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function myAssets(ctx) {
  const { userSession } = ctx.state;
  const assets = await getByUser(userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, assets };
}

/**
 * Get URL metadata
 * @param {*} ctx
 */
async function getUrlMetadata(ctx) {
  const { url } = ctx.request.query;
  if (isEmpty(url)) {
    throw new global.utils.HttpError(400, 'url is required');
  }
  const { body: html } = await global.utils.got(url);
  const metas = await global.utils.metascraper({ html, url });

  ctx.status = 200;
  ctx.body = { status: 200, metas };
}

/*
  getFiles: async (ctx) => {
    const { id } = ctx.params;
    const { userSession } = ctx.state;

    try {
      const files = await getFiles(id, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        files,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
*/
module.exports = {
  add: addAsset,
  remove: removeAsset,
  update: updateAsset,
  my: myAssets,
  get: getAsset,
  list: getAssets,
  listByIds: getAssetsByIds,
  urlMetadata: getUrlMetadata,
};
