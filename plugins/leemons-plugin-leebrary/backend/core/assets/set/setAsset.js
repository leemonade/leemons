const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { getById: getCategory } = require('../../categories/getById');
const { update } = require('../update');
const { add } = require('../add');
const canAssignRole = require('../../permissions/helpers/canAssignRole');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { getUsersByAsset } = require('../../permissions/getUsersByAsset');
const { CATEGORIES } = require('../../../config/constants');

// eslint-disable-next-line sonarjs/cognitive-complexity
async function setAsset({
  id,
  files: filesData,
  categoryId,
  tags,
  file: assetFile,
  cover: assetCover,
  ctx,
  ...assetData
}) {
  Object.keys(assetData).forEach((key) => {
    if (assetData[key] === 'null') {
      // eslint-disable-next-line no-param-reassign
      assetData[key] = null;
    }
  });

  if (_.isEmpty(categoryId)) {
    throw new LeemonsError(ctx, { message: 'Category is required', httpStatusCode: 400 });
  }

  const category = await getCategory({ id: categoryId, ctx });

  let file;
  let cover;

  // Media files
  if (category.key === CATEGORIES.MEDIA_FILES) {
    if (!filesData && !assetFile) {
      throw new LeemonsError(ctx, { message: 'No file was uploaded', httpStatusCode: 400 });
    }

    if (filesData?.files) {
      const files = filesData.files.length ? filesData.files : [filesData.files];

      if (files.length > 1) {
        throw new LeemonsError(ctx, {
          message: 'Multiple file uploading is not enabled yet',
          httpStatusCode: 501,
        });
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

  if (_.isString(tagValues)) {
    tagValues = tagValues.split(',');
  }

  let asset;

  if (assetData.subjects) {
    // eslint-disable-next-line no-param-reassign
    assetData.subjects = JSON.parse(assetData.subjects);
  }

  if (id) {
    asset = await update({
      data: { ...assetData, id, category, categoryId, cover, file, tags: tagValues },
      ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
    });
  } else {
    asset = await add({
      assetData: { ...assetData, category, categoryId, cover, file, tags: tagValues },
      ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
    });
  }

  const { role } = await getPermissions({ assetId: asset.id, ctx });

  let assetPermissions = await getUsersByAsset({ assetId: asset.id, ctx });
  assetPermissions = assetPermissions.map((user) => {
    const item = { ...user };
    item.editable = canAssignRole({
      userRole: role,
      assignedUserCurrentRole: item.permissions[0],
      newRole: item.permissions[0],
      ctx,
    });
    return item;
  });

  return { ...asset, canAccess: assetPermissions };
}

module.exports = { setAsset };
