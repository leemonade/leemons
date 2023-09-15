const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

// MOCKS
const { handlePermissions } = require('./handlePermissions');
const { handleExistence } = require('./handleExistence');

jest.mock('./handlePermissions');
jest.mock('./handleExistence');

const { add } = require('./add');
const { assetsFilesSchema } = require('../../../../models/assetsFiles');

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

it('should add a file to an asset successfully by either creating or updating the asset', async () => {
  // Arrange
  const fileId = 'fileId';
  const fileToReplace = 'fileToReplaceId';
  const oldAssetId = 'oldAssetId';
  const newAssetId = 'newAssetId';
  const skipPermissions = false;

  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  await ctx.tx.db.AssetsFiles.create({ asset: oldAssetId, file: fileToReplace });

  // Act
  const resultNewAsset = await add({ fileId, assetId: newAssetId, skipPermissions, ctx });
  const resultOldAsset = await add({ fileId, assetId: oldAssetId, skipPermissions, ctx });

  const fileNewAssetInDb = await ctx.tx.db.AssetsFiles.findOne({
    asset: newAssetId,
    file: fileId,
  }).lean();
  const fileOldAssetInDb = await ctx.tx.db.AssetsFiles.findOne({
    asset: oldAssetId,
    file: fileId,
  }).lean();

  // Assert
  expect(fileNewAssetInDb.asset).toEqual(resultNewAsset.asset);
  expect(fileNewAssetInDb.fileId).toEqual(resultNewAsset.fileId);
  expect(fileOldAssetInDb.asset).toEqual(resultOldAsset.asset);
  expect(fileOldAssetInDb.fileId).toEqual(resultOldAsset.fileId);
});

it('should throw an error when handlePermissions fails', async () => {
  // Arrange
  const fileId = 'fileId';
  const assetId = 'assetId';
  const skipPermissions = false;
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  const error = new LeemonsError(ctx, {
    message: 'Permission denied',
    httpStatusCode: 500,
  });
  handlePermissions.mockRejectedValue(error);

  // Act
  const action = add({ fileId, assetId, skipPermissions, ctx });

  // Assert
  await expect(action).rejects.toThrow({
    ...error,
    message: `Failed to add file: ${error.message}`,
  });
});

it('should throw an error when handleExistence fails', async () => {
  // Arrange
  const fileId = 'fileId';
  const assetId = 'assetId';
  const skipPermissions = false;
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  const error = new LeemonsError(ctx, {
    message: 'File does not exist',
    httpStatusCode: 500,
  });
  handleExistence.mockRejectedValue(error);

  // Act
  const action = add({ fileId, assetId, skipPermissions, ctx });

  // Assert
  await expect(action).rejects.toThrow({
    ...error,
    message: `Failed to add file: ${error.message}`,
  });
});
