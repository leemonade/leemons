const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { list } = require('./list');
const getCategory = require('../../../__fixtures__/getCategory');
const { categoriesSchema } = require('../../../models/categories');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

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
      Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
    },
  });
  categoryData = getCategory().categoryObject;
});

it('Should return categories list', async () => {
  // Arrange
  await ctx.db.Categories.create([
    { ...categoryData, id: 'id3', key: 'key3', order: 3 },
    { ...categoryData, id: 'id2', key: 'key2', order: 2 },
    { ...categoryData, id: 'id1', key: 'key1', order: 1 },
  ]);

  // Act
  const response = await list({ ctx });

  // Assert: Number of categories
  expect(response.items).toHaveLength(3);
  expect(response.count).toBe(3);
  // Assert: Categories order
  expect(response.items[0].order).toBe(1);
  expect(response.items[1].order).toBe(2);
  expect(response.items[2].order).toBe(3);
});

it('Should return empty array if no categories found', async () => {
  // Arrange

  // Act
  const response = await list({ page: 1, ctx });

  // Assert
  expect(response.items).toHaveLength(0);
  expect(response.count).toBe(0);
});
