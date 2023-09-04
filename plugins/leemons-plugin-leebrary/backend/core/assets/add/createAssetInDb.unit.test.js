const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const _ = require('lodash');

const { createAssetInDB } = require('./createAssetInDb')
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

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

it('Should correctly create an asset and return it as a plain object', async () => {
  // Arrange
  const {
    assetModel: { id: assetId, category: assetCategory, cover: assetCover, ...assetData },
    bookmarkAsset: { subjects, tags},
    assetDataExtraProps,
  } = getAssets();

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  // Act
  const response = await createAssetInDB({
    newId: assetId,
    categoryId: assetCategory,
    coverId: assetCover.id,
    assetData: { ...assetData, subjects, tags, assetDataExtraProps },
    ctx,
  });
  const foundAsset = await ctx.tx.db.Assets.findOne({ fromUser: assetData.fromUser }).lean();

  // Assert
  expect(response.id).toEqual(foundAsset.id);
  expect(foundAsset.cover).toEqual(assetCover.id);
  expect(foundAsset.tagline).toEqual(assetData.tagline)
  expect(_.isPlainObject(response)).toBe(true);
});

