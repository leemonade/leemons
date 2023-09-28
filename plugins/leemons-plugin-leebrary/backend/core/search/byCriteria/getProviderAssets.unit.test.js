const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getProviderAssets } = require('./getProviderAssets');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

jest.mock('../byProvider');
const { byProvider: getByProvider } = require('../byProvider');

const getTagsValueByPartialTags = jest.fn();

describe('getProviderAssets', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let asset;
  let assets;

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    ctx = generateCtx({
      actions: {
        'common.tags.getTagsValueByPartialTags': getTagsValueByPartialTags,
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

    asset = getAssets().assetModel;

    assets = [
      {
        ...asset,
        id: 'assetId1',
        name: 'First Asset',
      },
      {
        ...asset,
        id: 'assetId2',
        name: 'Second Asset',
      },
    ];
    await ctx.tx.db.Assets.create(assets);
  });

  describe('Intended workload', () => {
    it('should return assets by provider', async () => {
      // Arrange
      const criteria = 'First';
      getByProvider.mockResolvedValue([assets[0].id]);
      getTagsValueByPartialTags.mockResolvedValue([assets[0].id]);
      // Act
      const result = await getProviderAssets({
        categoryId: assets[0].category,
        criteria,
        searchInProvider: true,
        assets: assets.map((el) => el.id),
        indexable: true,
        ctx,
      });

      // Assert
      expect(getByProvider).toBeCalledWith({
        categoryId: assets[0].category,
        criteria,
        assets: assets.map((el) => el.id),
        ctx,
      });
      expect(result.assets).toEqual([assets[0].id]);
      expect(result.nothingFound).toEqual(false);
    });

    it('should return assets by provider with no case sensitive search', async () => {
      // Arrange
      const criteria = 'first';
      getByProvider.mockResolvedValue([assets[0].id]);
      getTagsValueByPartialTags.mockResolvedValue([assets[0].id]);
      // Act
      const result = await getProviderAssets({
        categoryId: assets[0].category,
        criteria,
        searchInProvider: true,
        assets: assets.map((el) => el.id),
        indexable: true,
        ctx,
      });

      // Assert
      expect(getByProvider).toBeCalledWith({
        categoryId: assets[0].category,
        criteria,
        assets: assets.map((el) => el.id),
        ctx,
      });
      expect(result.assets).toEqual([assets[0].id]);
      expect(result.nothingFound).toEqual(false);
    });
  });

  describe('Limit use cases', () => {
    it('should return  array if no assets match criteria', async () => {
      // Arrange
      const criteria = 'Other criteria';

      // Act
      const result = await getProviderAssets({
        categoryId: assets[0].category,
        criteria,
        ctx,
      });
      // Assert
      expect(getByProvider).toBeCalledTimes(0);
      expect(result.assets).toEqual([]);
      expect(result.nothingFound).toEqual(true);
    });
    it('should return same assets array if getByProvider returns an empty array', async () => {
      // Arrange
      const criteria = 'First';
      const assetIds = assets.map((el) => el.id);
      getByProvider.mockResolvedValue([]);

      // Act
      const result = await getProviderAssets({
        categoryId: assets[0].category,
        criteria,
        searchInProvider: true,
        assets: assetIds,
        indexable: true,
        ctx,
      });
      // Assert

      expect(getByProvider).toBeCalledWith({
        categoryId: assets[0].category,
        criteria,
        assets: assetIds,
        ctx,
      });
      expect(result.assets).toEqual(assets.map((el) => el.id));
      expect(result.nothingFound).toEqual(true);
    });

    it('should return same assets array if criteria is empty', async () => {
      // Arrange
      const criteria = undefined;
      const assetIds = assets.map((el) => el.id);
      getByProvider.mockResolvedValue([]);

      // Act
      const result = await getProviderAssets({
        criteria,
        searchInProvider: true,
        assets: assetIds,
        indexable: true,
        ctx,
      });
      // Assert

      expect(getByProvider).not.toBeCalled();
      expect(result.assets).toContain(assets[0].id);
      expect(result.assets).toContain(assets[1].id);
      expect(result.nothingFound).toEqual(false);
    });
  });
});
