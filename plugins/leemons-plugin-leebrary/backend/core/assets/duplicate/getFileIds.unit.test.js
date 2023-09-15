const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getFileIds } = require('./getFileIds');
const { assetsFilesSchema } = require('../../../models/assetsFiles');

const getAssets = require('../../../__fixtures__/getAssets');

// MOCKS
const { bookmarkAsset, mediaFileAsset } = getAssets();

let mongooseConnection;
let disconnectMongoose;

let ctx;

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

it('Should correctly return an array containing the cover id of an asset if any', async () => {
  // Arrange
  const asset = { ...bookmarkAsset, id: 'wrongId', cover: bookmarkAsset.cover.id };
  const expectedResponse = [asset.cover];
  const expectedResponseNoCover = [];
  ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  await ctx.tx.db.AssetsFiles.create({ asset: bookmarkAsset.id, file: null });
  // Act
  const response = await getFileIds({ asset: { ...asset }, ctx });
  const responseNoCoverNoFiles = await getFileIds({ asset: { ...asset, cover: null }, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(responseNoCoverNoFiles).toEqual(expectedResponseNoCover);
});

it('Should retrive files associated to an asset with no repetitions', async () => {
  // Arrange
  const asset = {
    ...mediaFileAsset,
    cover: mediaFileAsset.cover.id,
  };
  delete asset.file;
  const expectedResponse = [asset.cover, mediaFileAsset.file.id];
  const expectedResponseNoRepetitions = [mediaFileAsset.file.id];

  ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  await ctx.tx.db.AssetsFiles.create({ asset: mediaFileAsset.id, file: mediaFileAsset.file.id });

  // Act
  const response = await getFileIds({ asset: { ...asset }, ctx });
  const responseWithRepetitions = await getFileIds({
    asset: { ...asset, cover: mediaFileAsset.file.id },
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(responseWithRepetitions).toEqual(expectedResponseNoRepetitions);
});
