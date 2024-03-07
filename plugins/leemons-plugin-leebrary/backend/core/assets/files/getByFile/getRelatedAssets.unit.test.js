const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getRelatedAssets } = require('./getRelatedAssets');
const { assetsFilesSchema } = require('../../../../models/assetsFiles');
const getAssets = require('../../../../__fixtures__/getAssets');
const getBookmarkFromDB = require('../../../../__fixtures__/getBookmarkFromDB');

// MOCKS
jest.mock('../../../bookmarks/find');
jest.mock('../../find');
const { find: findBookmarks } = require('../../../bookmarks/find');
const { find: findAssets } = require('../../find');

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
});

const { assetModel } = getAssets();
const bookmarkFromDB = getBookmarkFromDB();

it('Should return only assets and bookmark asset Ids related to file', async () => {
  // Arrange
  const fileId = 'fileId';
  const asset = { ...assetModel, cover: fileId };
  const bookmark = { ...bookmarkFromDB, asset: 'bookmarkAssetId', icon: fileId };
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  const initialValues = [
    { asset: asset.id, file: fileId },
    { asset: 'asset2Id', file: fileId },
    { asset: 'notMatchingAsset', file: 'notMatchingFileId' },
  ];
  await ctx.db.AssetsFiles.create(initialValues);

  findAssets.mockResolvedValue([asset, { ...asset, id: 'asset3Id' }]);
  findBookmarks.mockResolvedValue([{ ...bookmark, asset: asset.id }, bookmark]);
  const expectedResponse = [asset.id, 'asset2Id', 'asset3Id', bookmark.asset].sort((a, b) =>
    a.localeCompare(b)
  );
  // Act
  const response = await getRelatedAssets({ fileId, ctx });
  response.sort((a, b) => a.localeCompare(b));

  // Assert
  expect(findAssets).toBeCalledWith({ query: { cover: fileId }, ctx });
  expect(findBookmarks).toBeCalledWith({ query: { icon: fileId }, ctx });
  expect(response).toEqual(expectedResponse);
});

it('Should return empty array if no related assets or bookmarks found', async () => {
  // Arrange
  const fileId = 'fileId';
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  findAssets.mockResolvedValue([]);
  findBookmarks.mockResolvedValue([]);
  const expectedResponse = [];
  // Act
  const response = await getRelatedAssets({ fileId, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should should not catch any error thrown by any of the inner functions', async () => {
  // Arrange
  const fileId = 'fileId';
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  findAssets.mockRejectedValue(new Error('findAssets error'));

  // Act
  const action = getRelatedAssets({ fileId, ctx });

  // Assert
  await expect(action).rejects.toThrow('findAssets error');
});
