const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { getByAsset } = require('./getByAsset');
const { assetsFilesSchema } = require('../../../../models/assetsFiles');

let mongooseConnection;
let disconnectMongoose;

jest.mock('./handleUserPermissions');
const { handleUserPermissions } = require('./handleUserPermissions');

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

it('should return an array of files when user has view permissions or checkPermissions is false', async () => {
  // Arrange
  const assetId = 'testAssetId';
  const initialValues = [
    { file: 'file1', asset: assetId },
    { file: 'file2', asset: assetId },
  ];
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  await ctx.tx.db.AssetsFiles.create(initialValues);
  handleUserPermissions.mockResolvedValue(true);
  const expectedResult = ['file1', 'file2'].sort((a, b) => a.localeCompare(b));

  // Act
  const result = await getByAsset({ assetId, ctx });
  const resultCheckPermissionsFalse = await getByAsset({ assetId, checkPermissions: false, ctx });

  // Assert
  expect(result.sort((a, b) => a.localeCompare(b))).toEqual(expectedResult);
  expect(resultCheckPermissionsFalse.sort((a, b) => a.localeCompare(b))).toEqual(expectedResult);
  expect(handleUserPermissions).toBeCalledTimes(1);
});

it('should return an empty array when user does not have view permissions', async () => {
  // Arrange
  const assetId = 'testAssetId';
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  handleUserPermissions.mockResolvedValue(false);

  // Act
  const result = await getByAsset({ assetId, ctx });

  // Assert
  expect(result).toEqual([]);
});

it('should throw a LeemonsError when an error at any depth', async () => {
  // Arrange
  const assetId = 'testAssetId';
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  const expectedError = {
    message: 'Failed to get files:',
    httpStatusCode: 500,
  };
  handleUserPermissions.mockImplementation(() => {
    throw new Error('Error getting permissions');
  });

  // Act
  let result;
  try {
    await getByAsset({ assetId, ctx });
  } catch (error) {
    result = error;
  }

  // Assert
  expect(result).toBeInstanceOf(LeemonsError);
  expect(result.httpStatusCode).toBe(expectedError.httpStatusCode);
  expect(result.message.startsWith(expectedError.message)).toBe(true);
});
