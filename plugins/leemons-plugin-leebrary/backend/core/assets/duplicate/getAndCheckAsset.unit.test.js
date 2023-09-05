const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

const { getAndCheckAsset } = require('./getAndCheckAsset');
const { assetsSchema } = require('../../../models/assets');

const getAssets = require('../../../__fixtures__/getAssets');

// MOCKS
const { assetModel } = getAssets();

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

it('Should retrieve an asset from the DB', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { ...assetModel, cover: 'coverPath' },
    { ...assetModel, cover: 'coverPath', id: 'otherId@1.0.0' },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getAndCheckAsset({ assetId: assetModel.id, ctx });

  // Assert
  expect(response.id).toEqual(assetModel.id);
  expect(response).toHaveProperty('createdAt');
  expect(_.isPlainObject(response)).toBe(true);
});

it('Should throw a LeemonsError if no asset is found', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { ...assetModel, cover: 'coverPath' },
    { ...assetModel, cover: 'coverPath', id: 'otherId@1.0.0' },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const notFoundResponse = async () => getAndCheckAsset({ ctx });

  // Assert
  await expect(notFoundResponse).rejects.toThrow(LeemonsError);
});
