const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { remove } = require('./remove');

const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');
const { CATEGORIES } = require('../../../config/constants');

jest.mock('../getByIds');
jest.mock('../../permissions/getByAsset');
jest.mock('../files/getByAsset');
jest.mock('../../categories/getById');
jest.mock('../../bookmarks/remove');
jest.mock('../files/remove');
jest.mock('../../permissions/helpers/getAssetPermissionName');

const { getByIds } = require('../getByIds');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { getByAsset: getFilesByAsset } = require('../files/getByAsset');
const { getById: getCategoryById } = require('../../categories/getById');
const { remove: removeBookmark } = require('../../bookmarks/remove');
const { remove: removeFiles } = require('../files/remove');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');

const permissions = {
  view: true,
  assign: true,
  comment: true,
  edit: true,
  delete: true,
  duplicate: true,
  canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
  canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
};
const files = ['f1fb124b-b7d4-4a81-81d1-e7f179f6e96'];

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
  jest.resetAllMocks();
});

it('Should remove an Bookmark Asset correctly', async () => {
  // Arrange
  const { bookmarkAsset: asset } = getAssets();
  asset.cover = asset.cover.id;

  const permissionName = `leebrary.(ASSET_ID)${asset.id}`;
  const soft = undefined;

  const removeAllTagsForValues = jest.fn();
  const beforeRemoveAsset = jest.fn();
  const removeCustomPermissionFormAllUserAgents = jest.fn();
  const removePermissions = jest.fn();
  const afterRemoveAsset = jest.fn();

  getByIds.mockResolvedValue([asset]);
  getPermissions.mockResolvedValue({
    permissions,
  });
  getFilesByAsset.mockResolvedValue([]); //! Es un Marcador no tiene archivos
  getCategoryById.mockResolvedValue({ key: CATEGORIES.BOOKMARKS });
  removeBookmark.mockResolvedValue();
  removeFiles.mockResolvedValue();
  getAssetPermissionName.mockReturnValue(permissionName);

  const ctx = generateCtx({
    actions: {
      'common.tags.removeAllTagsForValues': removeAllTagsForValues,
      'users.permissions.removeCustomPermissionForAllUserAgents':
        removeCustomPermissionFormAllUserAgents,
      'users.permissions.removeItems': removePermissions,
    },
    events: {
      'before-remove-asset': beforeRemoveAsset,
      'after-remove-asset': afterRemoveAsset,
    },

    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  await ctx.tx.db.Assets.create({ ...asset });

  // Act
  const response = await remove({ id: asset.id, ctx });
  const findAsset = await ctx.tx.db.Assets.findOne({ id: asset.id }).lean();

  // Assert
  expect(getByIds).toBeCalledWith({ ids: asset.id, ctx });
  expect(getPermissions).toBeCalledWith({ assetId: asset.id, ctx });
  expect(beforeRemoveAsset).toBeCalledWith({ assetId: asset.id, soft });
  expect(removeAllTagsForValues).toBeCalledWith({ type: ctx.prefixPN(''), values: asset.id });
  expect(getFilesByAsset).toBeCalledWith({ assetId: asset.id, ctx });
  expect(getCategoryById).toBeCalledWith({ id: asset.category, ctx });
  expect(removeBookmark).toBeCalledWith({ assetId: asset.id, ctx });
  expect(removeFiles).toBeCalledWith({ fileIds: asset.cover, assetId: asset.id, ctx });
  expect(getAssetPermissionName).toBeCalledWith({ assetId: asset.id, ctx });
  expect(removeCustomPermissionFormAllUserAgents).toBeCalledWith({ data: { permissionName } });
  expect(removePermissions).toBeCalledWith({
    query: {
      type: ctx.prefixPN(asset.category),
      item: asset.id,
    },
    soft,
  });
  expect(afterRemoveAsset).toBeCalledWith({ assetId: asset.id, soft });
  expect(response).toEqual(true);
  expect(findAsset).toEqual(null);
});

it('Should remove a Asset different than a Bookmark correctly', async () => {
  // Arrange
  const { bookmarkAsset: asset } = getAssets();
  asset.cover = asset.cover.id;

  const permissionName = `leebrary.(ASSET_ID)${asset.id}`;
  const soft = undefined;

  const removeAllTagsForValues = jest.fn();
  const beforeRemoveAsset = jest.fn();
  const removeCustomPermissionFormAllUserAgents = jest.fn();
  const removePermissions = jest.fn();
  const afterRemoveAsset = jest.fn();

  getByIds.mockResolvedValue([asset]);
  getPermissions.mockResolvedValue({
    permissions: {
      view: true,
      assign: true,
      comment: true,
      edit: true,
      delete: true,
      duplicate: true,
      canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
      canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
    },
  });
  getFilesByAsset.mockResolvedValue(files);
  getCategoryById.mockResolvedValue({ key: CATEGORIES.MEDIA_FILES });
  removeBookmark.mockResolvedValue();
  removeFiles.mockResolvedValue();
  getAssetPermissionName.mockReturnValue(permissionName);

  const ctx = generateCtx({
    actions: {
      'common.tags.removeAllTagsForValues': removeAllTagsForValues,
      'users.permissions.removeCustomPermissionForAllUserAgents':
        removeCustomPermissionFormAllUserAgents,
      'users.permissions.removeItems': removePermissions,
    },
    events: {
      'before-remove-asset': beforeRemoveAsset,
      'after-remove-asset': afterRemoveAsset,
    },

    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  await ctx.tx.db.Assets.create({ ...asset });

  // Act
  const response = await remove({ id: asset.id, ctx });
  const findAsset = await ctx.tx.db.Assets.findOne({ id: asset.id }).lean();

  // Assert
  expect(getByIds).toBeCalledWith({ ids: asset.id, ctx });
  expect(getPermissions).toBeCalledWith({ assetId: asset.id, ctx });
  expect(beforeRemoveAsset).toBeCalledWith({ assetId: asset.id, soft });
  expect(removeAllTagsForValues).toBeCalledWith({ type: ctx.prefixPN(''), values: asset.id });
  expect(getFilesByAsset).toBeCalledWith({ assetId: asset.id, ctx });
  expect(getCategoryById).toBeCalledWith({ id: asset.category, ctx });
  expect(removeFiles).toHaveBeenNthCalledWith(1, { fileIds: files, assetId: asset.id, ctx });
  expect(removeBookmark).toHaveBeenCalledTimes(0);
  expect(removeFiles).toHaveBeenNthCalledWith(2, { fileIds: asset.cover, assetId: asset.id, ctx });
  expect(getAssetPermissionName).toBeCalledWith({ assetId: asset.id, ctx });
  expect(removeCustomPermissionFormAllUserAgents).toBeCalledWith({ data: { permissionName } });
  expect(removePermissions).toBeCalledWith({
    query: {
      type: ctx.prefixPN(asset.category),
      item: asset.id,
    },
    soft,
  });
  expect(afterRemoveAsset).toBeCalledWith({ assetId: asset.id, soft });
  expect(response).toEqual(true);
  expect(findAsset).toEqual(null);
});

// !!! hacer los no happy path
// ! Por ejemplo cuando no existe el asset
// const testFunctionError = async () => {
//   await remove({ id: 'sdfsdf', ctx });
// };
// await expect(testFunctionError).rejects.toThrowError(
//   new LeemonsError(ctx, {
//     message: `Asset with ${id} does not exists`,
//     httpStatusCode: 500,
//   })
// );
