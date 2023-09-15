const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getByKey } = require('./getByKey');
const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

describe('Get Category by Key', () => {
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
    await ctx.tx.db.Categories.create(categoryData);
  });

  it('Should correctly get category by key and return category object', async () => {
    // Arrange
    const { key } = categoryData;
    const columns = ['name', 'description', 'canUse'];

    // Act
    const response = await getByKey({ key, columns, ctx });

    // Assert
    expect(response.name).toBe(categoryData.name);
    expect(response.key).toBeUndefined();
  });

  it('Should return null if no category found for the provided key', async () => {
    // Arrange
    const key = 'nonExistingKey';
    const columns = ['name', 'description'];

    // Act
    const response = await getByKey({ key, columns, ctx });

    // Assert
    expect(response).toBeNull();
  });
});
