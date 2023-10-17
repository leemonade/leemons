const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { byDescription } = require('./byDescription');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

jest.mock('../../assets/getByIds');
const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

describe('byDescription', () => {
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
        description: 'First Asset',
      },
      {
        ...asset,
        id: 'assetId2',
        description: 'Second Asset',
      },
    ];
    await ctx.tx.db.Assets.create(assets);
  });

  describe('Intended workload', () => {
    it('should return assets by description', async () => {
      // Arrange
      const description = 'First';
      getAssetsByIds.mockResolvedValue([assets[0]]);
      // Act
      const result = await byDescription({
        description,
        ctx,
        details: true,
        assets: assets.map((el) => el.id),
      });
      // Assert
      expect(getAssetsByIds).toBeCalledWith({ ids: [assets[0].id], ctx });
      expect(result).toEqual([assets[0]]);
    });
    it('should return assets by description with no case sensitive search', async () => {
      // Arrange
      const description = 'first';
      getAssetsByIds.mockResolvedValue([assets[0]]);
      // Act
      const result = await byDescription({
        description,
        ctx,
        details: true,
        assets: assets.map((el) => el.id),
      });
      // Assert
      expect(getAssetsByIds).toBeCalledWith({ ids: [assets[0].id], ctx });
      expect(result).toEqual([assets[0]]);
    });
  });

  describe('Limit use cases', () => {
    it('should return empty array if no assets match description', async () => {
      // Arrange
      const description = 'Other description';

      // Act
      const result = await byDescription({ description, ctx });

      // Assert
      expect(getAssetsByIds).toBeCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw an error if description is missing', async () => {
      // Arrange
      const descriptionMissing = undefined;

      // Act
      const testFunc = async () => byDescription({ description: descriptionMissing, ctx });

      // Assert
      await expect(testFunc).rejects.toThrowError(LeemonsError);
    });
  });
});
