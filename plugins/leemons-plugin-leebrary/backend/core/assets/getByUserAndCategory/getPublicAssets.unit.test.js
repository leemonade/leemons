const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { getPublicAssets } = require('./getPublicAssets');
const { assetsSchema } = require('../../../models/assets');

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

it('Should return an array of public assets when includePublic is true', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryOne', public: true, indexable: true };

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    asset,
    { id: 'assetTwo', category: 'categoryTwo', public: false, indexable: true },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getPublicAssets({
    includePublic: true,
    categoryId: 'categoryOne',
    indexable: true,
    ctx,
  });

  // Assert
  expect(response).toHaveLength(1);
  expect(_.isPlainObject(response[0])).toBe(true);
});

it('Should return an empty array when includePublic is false', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  // Act
  const response = await getPublicAssets({
    includePublic: false,
    categoryId: 'categoryOne',
    indexable: true,
    ctx,
  });

  // Assert
  expect(response).toHaveLength(0);
});

it('Should return an empty array when there are no public assets in the specified category', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryOne', public: false, indexable: true };

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    asset,
    { id: 'assetTwo', category: 'categoryTwo', public: true, indexable: true },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getPublicAssets({
    includePublic: true,
    categoryId: 'categoryOne',
    indexable: true,
    ctx,
  });

  // Assert
  expect(response).toHaveLength(0);
});

it('Should return an empty array when there are no indexable assets in the specified category', async () => {
  // Arrange
  const asset = { id: 'assetOne', category: 'categoryOne', public: true, indexable: false };

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    asset,
    { id: 'assetTwo', category: 'categoryTwo', public: true, indexable: true },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getPublicAssets({
    includePublic: true,
    categoryId: 'categoryOne',
    indexable: true,
    ctx,
  });

  // Assert
  expect(response).toHaveLength(0);
});
