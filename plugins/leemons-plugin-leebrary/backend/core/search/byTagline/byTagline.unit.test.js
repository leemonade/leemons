const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { byTagline } = require('./byTagline');
const { assetsSchema } = require('../../../models/assets');
const getAssets = require('../../../__fixtures__/getAssets');

jest.mock('../../assets/getByIds');
const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

describe('byTagline', () => {
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
        tagline: 'First asset TagLine',
      },
      {
        ...asset,
        id: 'assetId2',
        tagline: 'Second asset TagLine',
      },
    ];
    await ctx.tx.db.Assets.create(assets);
  });

  it('should return assets with the given tagline', async () => {
    // Arrange
    const tagline = 'First';

    // Act
    const result = await byTagline({ tagline, ctx });

    // Assert
    expect(result).toEqual(['assetId1']);
  });

  it('should return assets with the given tagline (no sensitive search)', async () => {
    // Arrange
    const tagline = 'first';

    // Act
    const result = await byTagline({ tagline, ctx });

    // Assert
    expect(result).toEqual(['assetId1']);
  });

  it('should return detailed assets with the given tagline and details true params', async () => {
    // Arrange
    const tagline = 'First';
    const details = true;
    getAssetsByIds.mockResolvedValue([assets[0].id]);

    // Act
    const result = await byTagline({ tagline, ctx, details, assets: assets.map((el) => el.id) });

    // Assert
    expect(getAssetsByIds).toBeCalledWith({ ids: [assets[0].id], ctx });
    expect(result).toEqual(['assetId1']);
  });

  it('should throw an error if function fails', async () => {
    // Arrange
    const tagline = 'First';
    const details = true;
    const errorMessage = 'Error Message';
    getAssetsByIds.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Act
    const testFunc = async () =>
      byTagline({ tagline, ctx, details, assets: assets.map((el) => el.id) });

    // Assert
    await expect(testFunc()).rejects.toThrow(LeemonsError, errorMessage);
  });
});
