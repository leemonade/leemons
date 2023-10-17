const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { find } = require('./find');
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
  const query = { public: true };
  const columns = ['id', 'indexable'];

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { public: true, id: 'asset1', indexable: true },
    { public: false, id: 'asset2', indexable: true },
    { public: true, id: 'asset3', indexable: false },
  ];
  await ctx.db.Assets.create(initialValues);
  const expectedResponse = [
    { id: initialValues[0].id, indexable: initialValues[0].indexable },
    { id: initialValues[2].id, indexable: initialValues[2].indexable },
  ];

  // Act
  let response = await find({ query, columns, ctx });
  response = response.sort((a, b) => a.id.localeCompare(b.id));

  // Assert
  response.forEach((obj, i) => {
    expect(obj.id).toEqual(expectedResponse[i].id);
    expect(obj.indexable).toEqual(expectedResponse[i].indexable);
    expect(obj.public).toBe(undefined);
    expect(_.isPlainObject(obj)).toBe(true);
  });
});

it('Should accept emtpy object as query and columns', async () => {
  // Arrange
  const query = {};
  const columns = {};

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { public: true, id: 'asset1', indexable: true },
    { public: false, id: 'asset2', indexable: true },
    { public: true, id: 'asset3', indexable: false },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await find({ query, columns, ctx });

  // Assert
  expect(response.length).toBe(initialValues.length);
  response.forEach((obj) => {
    expect(obj).toHaveProperty(['id']);
    expect(obj).toHaveProperty(['public']);
    expect(obj).toHaveProperty(['indexable']);
  });
});

it('Should not catch db errors provoked by wrong query or columns values', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const responseWrongQuery = async () => find({ query: 123, ctx });
  const responseWrongColumns = async () => find({ query: {}, columns: 123, ctx });

  // Act and Assert
  await expect(responseWrongQuery).rejects.toThrow();
  await expect(responseWrongColumns).rejects.toThrow();
});
