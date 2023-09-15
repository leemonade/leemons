const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getByIds } = require('./getByIds');
const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

let mongooseConnection;
let disconnectMongoose;

describe('Get categories by IDs', () => {
  let categories;

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

    const category = getCategory().categoryObject;
    categories = [
      { ...category, id: 'cat1', key: 'keyCat1' },
      { ...category, id: 'cat2', key: 'keyCat2' },
      { ...category, id: 'cat3', key: 'keyCat3' },
    ];
  });

  it('Should correctly retrieve categories by their IDs', async () => {
    // Arrange
    const categoriesIds = ['cat1', 'cat2', 'cat3'];
    const ctx = generateCtx({
      models: {
        Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
      },
    });

    // Populate the database with mock data
    await ctx.tx.db.Categories.create(categories);

    // Act
    const response = await getByIds({ categoriesIds, ctx });

    // Assert
    expect(response).toHaveLength(3);
    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'cat1', key: 'keyCat1' }),
        expect.objectContaining({ id: 'cat2', key: 'keyCat2' }),
        expect.objectContaining({ id: 'cat3', key: 'keyCat3' }),
      ])
    );
  });

  it('Should return empty array if no categories found', async () => {
    // Arrange
    const categoriesIds = ['cat1', 'cat2', 'cat3'];
    const ctx = generateCtx({
      models: {
        Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
      },
    });

    // Act
    const response = await getByIds({ categoriesIds, ctx });

    // Assert
    expect(response).toStrictEqual([]);
  });
});
