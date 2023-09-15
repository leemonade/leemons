const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { getByCategory } = require('./getByCategory');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

// MOCKS
jest.mock('../getByIds/getByIds');
const { getByIds } = require('../getByIds/getByIds');

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

const { bookmarkAsset, mediaFileAsset } = getAssets();

it('Should return assets by category as an array of asset Ids when details flag is falsy', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  const categoryId = 'categoryOne';
  const assetOne = { id: 'assetOne', category: categoryId };
  const assetTwo = { id: 'assetTwo', category: categoryId };
  const initialValues = [assetOne, assetTwo];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = _.orderBy(await getByCategory({ categoryId, ctx }), 'id', 'asc');

  // Assert
  expect(response).toHaveLength(2);
  expect(response[0]).toHaveProperty('id', 'assetOne');
  expect(response[1]).toHaveProperty('id', 'assetTwo');
  expect(getByIds).not.toBeCalled();
});

it('Should return detailed assets when details is passed as true', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  const categoryId = 'categoryOne';
  const assetOne = { id: 'assetOne', category: categoryId, details: { description: 'Asset One' } };
  const assetTwo = { id: 'assetTwo', category: categoryId, details: { description: 'Asset Two' } };
  const initialValues = [assetOne, assetTwo];
  await ctx.db.Assets.create(initialValues);
  getByIds.mockResolvedValue([
    { ...bookmarkAsset, id: 'assetOne' },
    { ...mediaFileAsset, id: 'assetTwo' },
  ]);

  // Act
  const response = await getByCategory({ categoryId, ctx, details: true });

  // Assert
  expect(response).toHaveLength(2);
  expect(getByIds).toBeCalledWith({ assetsIds: [assetOne.id, assetTwo.id], ctx });
  expect(response[0]).toHaveProperty('id', 'assetOne');
  expect(response[0]).toHaveProperty('description', bookmarkAsset.description);
  expect(response[1]).toHaveProperty('id', 'assetTwo');
  expect(response[1]).toHaveProperty('description', mediaFileAsset.description);
});

it('Should use assetIds to filter the query when passed', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  const categoryId = 'categoryOne';
  const assetOne = { id: 'assetOne', category: categoryId };
  const assetTwo = { id: 'assetTwo', category: categoryId };
  const assetThree = { id: 'assetThree', category: categoryId };
  const initialValues = [assetOne, assetTwo, assetThree];
  await ctx.db.Assets.create(initialValues);
  const assetIds = ['assetOne', 'assetTwo'];

  // Act
  const response = await getByCategory({ categoryId, assets: assetIds, ctx });

  // Assert
  expect(response).toHaveLength(2);
  expect(response[0]).toHaveProperty('id', 'assetOne');
  expect(response[1]).toHaveProperty('id', 'assetTwo');
});

it('Should return an empty array if no assets found for the category', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  const categoryId = 'categoryOne';

  // Act
  const response = await getByCategory({ categoryId, ctx });

  // Assert
  expect(response).toEqual([]);
});

it('Catches any error and throws a LeemonsError with a httpStatusCode of 500 and the error info', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const testFnToThrow = async () => getByCategory({ categoryId: {}, ctx });
  // Act & Assert
  try {
    await testFnToThrow();
  } catch (error) {
    expect(error instanceof LeemonsError).toBe(true);
    expect(error.message.startsWith('Failed to get category assets:')).toBe(true);
    expect(error.httpStatusCode).toBe(500);
  }
});

it('Should return assets as plain JS objects', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  const categoryId = 'categoryOne';
  const assetOne = { id: 'assetOne', category: categoryId };
  const assetTwo = { id: 'assetTwo', category: categoryId };
  const initialValues = [assetOne, assetTwo];
  await ctx.db.Assets.create(initialValues);
  getByIds.mockResolvedValue([
    { ...bookmarkAsset, id: 'assetOne' },
    { ...mediaFileAsset, id: 'assetTwo' },
  ]);

  // Act
  const response = await getByCategory({ categoryId, ctx });

  // Assert
  expect(_.isPlainObject(response[0])).toBe(true);
  expect(_.isPlainObject(response[1])).toBe(true);
});
