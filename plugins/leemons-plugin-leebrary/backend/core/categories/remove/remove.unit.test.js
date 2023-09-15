const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { remove } = require('./remove');
const { categoriesSchema } = require('../../../models/categories');
const getCategory = require('../../../__fixtures__/getCategory');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let categoryData;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;

  ctx = generateCtx({
    actions: {},
    models: {
      Categories: newModel(mongooseConnection, 'Categories', categoriesSchema),
    },
  });

  categoryData = getCategory().categoryObject;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();

  await ctx.tx.db.Categories.create(categoryData);
});

it('Should remove a category', async () => {
  // Arrange

  // Act
  const response = await remove({ category: categoryData, ctx });
  const expectedValue = await ctx.tx.db.Categories.findOne({ id: categoryData.id }).lean();

  // Assert
  expect(response).toStrictEqual({ acknowledged: true, deletedCount: 1 });
  expect(expectedValue).toEqual(null);
});

it('Should throw an error if function fails', async () => {
  // Arrange
  const errorMessage = 'Error';
  ctx.tx.db.Categories.deleteMany = jest.fn().mockImplementation(() => {
    throw new Error(errorMessage);
  });
  // Act
  const testFunc = async () => remove({ category: categoryData, ctx });

  // Assert
  await expect(testFunc).rejects.toThrowError(
    new LeemonsError(ctx, {
      message: `Failed to remove category: ${errorMessage}`,
      httpStatusCode: 500,
    })
  );
});
