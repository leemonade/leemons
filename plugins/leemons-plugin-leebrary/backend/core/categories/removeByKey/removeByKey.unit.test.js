const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { removeByKey } = require('./removeByKey');
const { categoriesSchema } = require('../../../models/categories');
const { assetsSchema } = require('../../../models/assets');
const getCategory = require('../../../__fixtures__/getCategory');
const getAssets = require('../../../__fixtures__/getAssets');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

describe('Remove category by key', () => {
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
    categoryData = getCategory().categoryObject;
    ctx = generateCtx({
      models: {
        Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
        Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
      },
    });
    // Populate the database with mock data
    await ctx.tx.db.Categories.create(categoryData);
  });

  it('Should correctly remove category by key', async () => {
    // Arrange
    const categoryKey = categoryData.key;

    // Act
    const response = await removeByKey({ categoryKey, ctx });

    const categoryRecords = await ctx.tx.db.Categories.find({
      key: categoryKey,
    }).lean();

    // Assert
    expect(response).toStrictEqual({ acknowledged: true, deletedCount: 1 });
    expect(categoryRecords).toEqual([]);
  });

  it('Should throw an error if category key is empty', async () => {
    // Arrange
    const categoryKey = '';

    // Act and Assert
    await expect(removeByKey({ categoryKey, ctx })).rejects.toThrow(
      new LeemonsError(ctx, { message: 'Category key is required.', httpStatusCode: 400 })
    );
  });

  it('Should throw an error if category not found', async () => {
    // Arrange
    const categoryKey = 'nonExistentKey';

    // Act and Assert
    await expect(removeByKey({ categoryKey, ctx })).rejects.toThrow('Category not found.');
  });

  it('Should throw an error if category has assets', async () => {
    // Arrange
    const asset = { ...getAssets().assetModel, category: categoryData.id };
    // Populate the database with mock data
    await ctx.tx.db.Assets.create(asset);

    // Act and Assert
    await expect(removeByKey({ categoryKey: categoryData.key, ctx })).rejects.toThrow(
      new LeemonsError(ctx, { message: 'Category has assets.', httpStatusCode: 400 })
    );
  });
  it('Should throw an error if function fails', async () => {
    // Arrange
    const categoryKey = categoryData.key;
    const errorMessage = 'Error';
    // Mock the Categories.deleteMany function to throw an error
    ctx.tx.db.Categories.deleteMany = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Act and Assert
    await expect(removeByKey({ categoryKey, ctx })).rejects.toThrow(
      new LeemonsError(ctx, {
        message: `Failed to remove category: ${errorMessage}`,
        httpStatusCode: 500,
      })
    );
  });
});
