const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const getCategory = require('../../../__fixtures__/getCategory');
const { add } = require('./add');
const { categoriesSchema } = require('../../../models/categories');

jest.mock('../exists');
const { exists } = require('../exists');

describe('add category', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let categoryData;
  let menu;
  let addItemsFromPlugin;

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    addItemsFromPlugin = jest.fn();
    ctx = generateCtx({
      actions: { 'menu-builder.menuItem.addItemsFromPlugin': addItemsFromPlugin },
      models: {
        Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
      },
      caller: 'leemons-testing',
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

    menu = {
      removed: false,
      item: {
        key: 'testKey',
        order: 1,
      },
      permissions: 'testPermissions',
    };
  });

  it('should add a category', async () => {
    // Arrange
    exists.mockResolvedValue(false);
    const idWithoutComponentOwner = 'idWithoutComponentOwner';

    // Act
    const result = await add({ data: { ...categoryData, menu }, ctx });
    const resultWithoutComponentOwner = await add({
      data: { ...categoryData, menu, componentOwner: undefined, id: idWithoutComponentOwner },
      ctx,
    });

    // Assert
    expect(exists).toBeCalledWith({ categoryData, ctx });
    expect(result.id).toEqual(categoryData.id);
    expect(resultWithoutComponentOwner.id).toEqual(idWithoutComponentOwner);
  });

  it('should not add a category if it already exists', async () => {
    // Arrange
    exists.mockResolvedValue(true);

    // Act
    expect(exists).toBeCalledWith({ categoryData, ctx });
    const result = await add({ data: { ...categoryData, menu }, ctx });

    // Assert
    expect(result).toBeNull();
  });
  it('should not add a category if key is missing', async () => {
    // Arrange
    exists.mockResolvedValue(false);
    const categoryDataWithoutKey = { ...categoryData, key: undefined };

    // Act
    const testFuncWithoutKey = async () => add({ data: { ...categoryDataWithoutKey, menu }, ctx });
    const testFuncWithoutMenu = async () => add({ data: { ...categoryData }, ctx });

    // Assert
    await expect(testFuncWithoutKey).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Category `key` is required',
        httpStatusCode: 400,
      })
    );
    await expect(testFuncWithoutMenu).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Category `menu` is required',
        httpStatusCode: 400,
      })
    );
  });
  it('should throw an error if there is an error inside the function', async () => {
    // Arrange
    const errorMessage = 'An error message';
    exists.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    // Act
    const testFuncWithFaultyData = async () => add({ data: { ...categoryData, menu }, ctx });

    // Assert
    await expect(testFuncWithFaultyData).rejects.toThrow(
      new LeemonsError(ctx, {
        message: `Failed to register category: ${errorMessage}`,
        httpStatusCode: 500,
      })
    );
  });
});
