const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { byProvider } = require('./byProvider');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');
const getCategory = require('../../../__fixtures__/getCategory');
const getProviders = require('../../../__fixtures__/getProviders');

jest.mock('../../assets/getByIds');
const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

jest.mock('../../providers/getByName');
const { getByName: getProviderByName } = require('../../providers/getByName');

jest.mock('../../categories/getById');
const { getById: getCategoryById } = require('../../categories/getById');

describe('byProvider', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;

  const asset = getAssets().assetModel;
  const assets = [
    {
      ...asset,
      id: 'assetId1',
      provider: 'First Provider',
    },
    {
      ...asset,
      id: 'assetId2',
      provider: 'Second Provider',
    },
  ];

  const category = { ...getCategory().categoryObject, provider: 'leebrary-aws-s3' };
  const provider = { ...getProviders().provider.value.params, supportedMethods: { search: true } };
  const assetsSearchHandler = jest.fn().mockResolvedValue([assets[0]].id);

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    ctx = generateCtx({
      actions: {
        [`${provider.pluginName}.assets.search`]: assetsSearchHandler,
      },
      models: {
        Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
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
    jest.resetAllMocks();

    await ctx.tx.db.Assets.create(assets);
  });

  it('should return assets by provider', async () => {
    // Arrange
    getCategoryById.mockReturnValue(category);
    getProviderByName.mockReturnValue(provider);
    getAssetsByIds.mockResolvedValue([assets[0]]);
    assetsSearchHandler.mockResolvedValue([assets[0].id]);
    // Act
    const result = await byProvider({
      ctx,
      categoryId: category.id,
      details: true,
      assets: assets.map((el) => el.id),
    });
    // Assert
    expect(getCategoryById).toBeCalledWith({ id: category.id, ctx });
    expect(getProviderByName).toBeCalledWith({ name: category.provider, ctx });
    expect(getAssetsByIds).toBeCalledWith({ ids: [assets[0].id], ctx });
    expect(result).toEqual([assets[0]]);
  });

  it('should return assets by provider, only ids, if details param is not true', async () => {
    // Arrange
    getCategoryById.mockReturnValue(category);
    getProviderByName.mockReturnValue(provider);
    getAssetsByIds.mockResolvedValue([assets[0]]);
    assetsSearchHandler.mockResolvedValue([assets[0].id]);
    // Act
    const result = await byProvider({
      ctx,
      categoryId: category.id,
      assets: assets.map((el) => el.id),
    });
    // Assert
    expect(getCategoryById).toBeCalledWith({ id: category.id, ctx });
    expect(getProviderByName).toBeCalledWith({ name: category.provider, ctx });
    expect(getAssetsByIds).toBeCalledTimes(0);
    expect(result).toEqual([assets[0].id]);
  });

  it('should return null if provider is missing', async () => {
    // Arrange

    // Act
    // Arrange
    getCategoryById.mockReturnValue(category);
    getProviderByName.mockReturnValue(null);

    // Act
    const result = await byProvider({
      ctx,
      categoryId: category.id,
      details: true,
      assets: assets.map((el) => el.id),
    });
    // Assert
    expect(getCategoryById).toBeCalledWith({ id: category.id, ctx });
    expect(getProviderByName).toBeCalledWith({ name: category.provider, ctx });
    expect(getAssetsByIds).toBeCalledTimes(0);
    expect(result).toBeNull();
  });
  it('should return null if provider supportedMethods not contains "search"', async () => {
    // Arrange

    // Act
    // Arrange
    getCategoryById.mockReturnValue(category);
    getProviderByName.mockReturnValue({ ...provider, supportedMethods: { otherMethod: true } });

    // Act
    const result = await byProvider({
      ctx,
      categoryId: category.id,
      details: true,
      assets: assets.map((el) => el.id),
    });
    // Assert
    expect(getCategoryById).toBeCalledWith({ id: category.id, ctx });
    expect(getProviderByName).toBeCalledWith({ name: category.provider, ctx });
    expect(getAssetsByIds).toBeCalledTimes(0);
    expect(result).toBeNull();
  });

  it('should return Error if category is not found', async () => {
    // Arrange
    getCategoryById.mockResolvedValue(null);
    // Act
    const testFunc = async () =>
      byProvider({
        ctx,
        categoryId: 'otherCategoryId',
        details: true,
        assets: assets.map((el) => el.id),
      });
    // Assert
    await expect(testFunc).rejects.toThrow(
      new LeemonsError(ctx, { message: 'Category is required', httpStatusCode: 400 })
    );
    expect(getAssetsByIds).toBeCalledTimes(0);
  });

  it('should return Error if either category or categoryId params is not passed', async () => {
    // Arrange
    getCategoryById.mockResolvedValue(null);
    // Act
    const testFunc = async () =>
      byProvider({
        ctx,
        details: true,
        assets: assets.map((el) => el.id),
      });
    // Assert
    await expect(testFunc).rejects.toThrow(
      new LeemonsError(ctx, { message: 'Category is required', httpStatusCode: 400 })
    );
    expect(getAssetsByIds).toBeCalledTimes(0);
  });

  it('should return Error if byProvider method fails', async () => {
    // Arrange
    const errorMessage = 'Error Message';
    getCategoryById.mockReturnValue(category);
    getProviderByName.mockReturnValue(provider);
    assetsSearchHandler.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    // Act
    const testFunc = async () =>
      byProvider({
        ctx,
        categoryId: 'otherCategoryId',
      });
    // Assert
    await expect(testFunc).rejects.toThrow(
      new LeemonsError(ctx, {
        message: `Failed to find asset in provider: ${errorMessage}`,
        httpStatusCode: 500,
      })
    );
  });
});
