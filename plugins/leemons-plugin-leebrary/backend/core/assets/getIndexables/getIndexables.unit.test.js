const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { getIndexables } = require('./getIndexables');
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

it('Should correctly query the db and return the desired fields', async () => {
  // Arrange
  const assetIds = ['asset1', 'asset3'];
  const columns = ['id', 'indexable'];

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { id: 'asset1', indexable: true },
    { id: 'asset2', indexable: true },
    { id: 'asset3', indexable: false },
  ];
  await ctx.db.Assets.create(initialValues);
  const expectedResponse = [
    { id: initialValues[0].id, indexable: initialValues[0].indexable },
    { id: initialValues[2].id, indexable: initialValues[2].indexable },
  ];

  // Act
  let response = await getIndexables({ assetIds, columns, ctx });
  response = response.sort((a, b) => a.id.localeCompare(b.id));

  // Assert
  response.forEach((obj, i) => {
    expect(obj.id).toEqual(expectedResponse[i].id);
    expect(obj.indexable).toEqual(expectedResponse[i].indexable);
    expect(_.isPlainObject(obj)).toBe(true);
  });
});

it('Should return empty array if no matching assetIds are found', async () => {
  // Arrange
  const assetIds = ['asset4', 'asset5'];
  const columns = ['id', 'indexable'];

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { id: 'asset1', indexable: true },
    { id: 'asset2', indexable: true },
    { id: 'asset3', indexable: false },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getIndexables({ assetIds, columns, ctx });

  // Assert
  expect(response).toEqual([]);
});

it('Should not throw if assetsIds is not passed', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { id: 'asset1', indexable: true },
    { id: 'asset2', indexable: true },
    { id: 'asset3', indexable: false },
  ];
  await ctx.db.Assets.create(initialValues);
  const response = await getIndexables({ ctx });

  // Act and Assert
  expect(response).toEqual([]);
});
