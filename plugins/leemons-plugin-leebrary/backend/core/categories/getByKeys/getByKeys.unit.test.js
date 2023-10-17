const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByKeys } = require('./getByKeys');
const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

describe('Get categories by keys', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    ctx = generateCtx({
      models: {
        Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
      },
    });
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();

    categoryData = getCategory().categoryObject;
    // Populate the database with mock data
    await ctx.tx.db.Categories.create([
      { ...categoryData, id: 'id1', key: 'key1' },
      { ...categoryData, id: 'id2', key: 'key2' },
    ]);
  });

  it('Should correctly retrieve categories by keys', async () => {
    // Arrange
    const keys = ['key1', 'key2'];

    // Act
    const categories = await getByKeys({ keys, ctx });

    // Assert
    expect(categories).toHaveLength(2);
    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'id1', key: 'key1' }),
        expect.objectContaining({ id: 'id2', key: 'key2' }),
      ])
    );
  });

  it('Should return an empty array if no categories match the provided keys', async () => {
    // Arrange
    const keys = ['key3', 'key4'];

    // Act
    const categories = await getByKeys({ keys, ctx });

    // Assert
    expect(categories).toEqual([]);
  });
});
