const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { getByAssets } = require('./getByAssets');
const { assetsFilesSchema } = require('../../../models/assetsFiles');

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

it('Should call getByAssets correctly', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const assetIds = ['asset1', 'asset2'];
  const initialValues = [
    { asset: 'asset1', file: 'file1' },
    { asset: 'asset2', file: 'file2' },
  ];
  await ctx.db.AssetsFiles.create(initialValues);

  // Act
  let response = await getByAssets({ assetIds, ctx });
  response = response.sort((a, b) => a.asset.localeCompare(b.asset));

  // Assert
  expect(response).toHaveLength(initialValues.length);
  initialValues.forEach((initialValue, index) => {
    expect(response[index]).toMatchObject(initialValue);
    expect(_.isPlainObject(response[index])).toBe(true);
  });
});

it('Should return an empty array when no assets are found', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const assetIds = ['asset1', 'asset2'];

  // Act
  const response = await getByAssets({ assetIds, ctx });

  // Assert
  expect(response).toHaveLength(0);
});

it('Should throw when assetIds is a wrong value', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const assetIds = {};

  // Act
  const testFnToThrow = async () => getByAssets({ assetIds, ctx });

  // Assert
  await expect(testFnToThrow).rejects.toThrow();
});
