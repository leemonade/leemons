const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { byName } = require('./byName');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

jest.mock('../../assets/getByIds');
const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

describe('byName', () => {
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
    it('should return assets by name', async () => {
      // Arrange
      const name = 'First';
      getAssetsByIds.mockResolvedValue([assets[0]]);
      // Act
      const result = await byName({
        name,
        ctx,
        details: true,
        assets: assets.map((el) => el.id),
      });
      // Assert
      expect(getAssetsByIds).toBeCalledWith({ ids: [assets[0].id], ctx });
      expect(result).toEqual([assets[0]]);
    });
    it('should return assets by name with no case sensitive search', async () => {
      // Arrange
      const name = 'first';
      getAssetsByIds.mockResolvedValue([assets[0]]);
      // Act
      const result = await byName({
        name,
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
    it('should return empty array if no assets match name', async () => {
      // Arrange
      const name = 'Other name';

      // Act
      const result = await byName({ name, ctx });

      // Assert
      expect(getAssetsByIds).toBeCalledTimes(0);
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw an error if name is missing', async () => {
      // Arrange
      const nameMissing = undefined;

      // Act
      const testFunc = async () => byName({ name: nameMissing, ctx });

      // Assert
      await expect(testFunc).rejects.toThrowError(LeemonsError);
    });
  });
});
