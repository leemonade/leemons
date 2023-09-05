const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

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
  ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
    },
  });
  ctx.tx.db.AssetsFiles.create({ ...bookmarkAsset, cover: bookmarkAsset.cover.id });
});

it('Should correctly rturn an array containing the cover id for a bookmark asset', async () => {
  // Arrange
  const asset = { ...bookmarkAsset, id: 'wrongId', cover: bookmarkAsset.cover.id };
  const expectedResponse = [bookmarkAsset.cover.id];

  // Act
  const response = await getFileIds({ asset: { ...asset }, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should retrive all files associated to an asset with no repetitions', async () => {
  // Arrange
  const asset = {
    ...mediaFileAsset,
    cover: mediaFileAsset.cover.id,
  };
  delete asset.file;
  const expectedResponse = [bookmarkAsset.cover.id];

  // Act
  const response = await getFileIds({ asset: { ...asset }, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});
