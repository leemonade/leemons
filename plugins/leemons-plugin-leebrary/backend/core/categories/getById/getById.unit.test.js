const { expect, beforeAll, beforeEach, afterAll, describe, it } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getById } = require('./getById');

const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

describe('Get By Id Category Test', () => {
  // Arrange: Setting up the test environment
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let categoryData;

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

  // Arrange: Setting up the test parameters before each test
  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
    jest.resetAllMocks();
    categoryData = getCategory().categoryObject;

    // Insert test data into the Categories collection
    await ctx.tx.db.Categories.create(categoryData);
  });

  it('should find a category by id in the database', async () => {
    // Arrange

    // Act: Execution of the function to test
    const category = await getById({ id: categoryData.id, ctx });

    // Assert: Verification of the results
    expect(category).toBeDefined();
    expect(category.id).toBe(categoryData.id);
  });

  it('should return only key field', async () => {
    // Arrange
    const columns = 'key';
    // Act
    const category = await getById({ id: categoryData.id, columns, ctx });

    // Assert
    expect(category.key).toBeDefined();
    expect(category.canUse).not.toBeDefined();
  });

  it('should return null if no category is found', async () => {
    // Arrange
    const id = 'nonexistentCategory';

    // Act
    const category = await getById({ id, ctx });

    // Assert
    expect(category).toBeNull();
  });
});
