const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');

const { LeemonsError } = require('@leemons/error');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByAsset } = require('./getByAsset');
const { assetsSchema } = require('../../../models/assets');

const getAssetCategories = require('../../../__fixtures__/getCategory');
const getAssets = require('../../../__fixtures__/getAssets');

let mongooseConnection;
let disconnectMongoose;

jest.mock('../getByIds');
const { getByIds } = require('../getByIds');

describe('Get Categories by Asset', () => {
  let ctx;
  let assetData;
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
        Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
      },
    });

    assetData = getAssets().assetModel;
    categoryData = getAssetCategories().categoryObject;

    // Populate the database with mock data
    await ctx.tx.db.Assets.create(assetData);
  });

  it('Should correctly retrieve categories by asset', async () => {
    // Arrange
    const assetId = assetData.id;
    getByIds.mockReturnValue([categoryData]);

    // Act
    const response = await getByAsset({ assetId, ctx });

    // Assert
    expect(getByIds).toBeCalledWith({ categoriesIds: [assetData.category], ctx });
    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(1);
    expect(response[0].id).toBe(assetData.category);
  });

  it('Should return an empty array if the asset does not exist', async () => {
    // Arrange
    const assetId = 'nonexistentAssetId';
    getByIds.mockReturnValue([]);

    // Act
    const response = await getByAsset({ assetId, ctx });

    // Assert
    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(0);
  });

  it('Should throw an error (LeemonsError) if function fails', async () => {
    // Arrange
    const assetId = assetData.id;
    const errorMessage = 'Something went wrong';

    getByIds.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Act
    const testFunc = () => getByAsset({ assetId, ctx });

    // Assert
    await expect(testFunc).rejects.toThrow(
      new LeemonsError(ctx, {
        message: `Failed to get categories by asset: ${errorMessage}`,
        httpStatusCode: 500,
      })
    );
  });
});
