const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { exists } = require('./exists');

const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

describe('Exists Category Test', () => {
  // Arrange: Set up the test environment
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

  // Clean up after all tests have run
  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  // Arrange: Set up the test parameters before each test
  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
    jest.resetAllMocks();

    categoryData = getCategory().categoryObject;

    await ctx.tx.db.Categories.create(categoryData);
  });

  it('should return true if category exists in the database', async () => {
    // Arrange

    // Act
    const doesExist = await exists({ categoryData, ctx });
    const doesExistWithoutId = await exists({
      categoryData: { ...categoryData, id: undefined },
      ctx,
    });
    const doesExistWithoutKey = await exists({
      categoryData: { ...categoryData, key: undefined },
      ctx,
    });

    // Assert
    expect(doesExist).toBe(true);
    expect(doesExistWithoutId).toBe(true);
    expect(doesExistWithoutKey).toBe(true);
  });

  it('should return false if category does not exist in the database', async () => {
    // Arrange

    // Act
    const doesExist = await exists({ categoryData: { ...categoryData, id: 'otherId' }, ctx });

    // Assert
    expect(doesExist).toBe(false);
  });
});
