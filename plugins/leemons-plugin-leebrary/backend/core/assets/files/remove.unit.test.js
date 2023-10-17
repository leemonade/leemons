const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { remove } = require('./remove');
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

it('Should remove files correctly', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const fileIds = ['file1', 'file2'];
  const assetId = 'asset1';
  const initialValues = [
    { asset: assetId, file: 'file1' },
    { asset: 'asset2', file: 'file2' },
  ];
  await ctx.tx.db.AssetsFiles.create(initialValues);

  // Act
  const response = await remove({ fileIds, assetId, ctx });

  // Assert
  expect(response).toBe(true);
  const remainingFiles = await ctx.tx.db.AssetsFiles.find().lean();
  expect(remainingFiles).toHaveLength(1);
  expect(remainingFiles[0].file).toBe('file2');
});

it('Should return false when no files are found to remove', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const fileIds = ['file3'];

  // Act
  const response = await remove({ fileIds, ctx });

  // Assert
  expect(response).toBe(false);
});

it('Should throw when fileIds is a wrong value', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });

  const fileIds = {};
  const assetId = 'asset1';

  // Act
  const testFnToThrow = async () => remove({ fileIds, assetId, ctx });

  // Assert
  await expect(testFnToThrow).rejects.toThrow();
});
