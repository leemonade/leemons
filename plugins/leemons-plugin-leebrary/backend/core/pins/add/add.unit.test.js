const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { add } = require('./add');
const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');

jest.mock('../../assets/exists');
const { exists: checkAssetExists } = require('../../assets/exists');

jest.mock('../getByAsset');
const { getByAsset: getPinByAsset } = require('../getByAsset');

describe('add pin', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let assetId;
  let userSession;

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    userSession = getUserSession();

    ctx = generateCtx({
      models: {
        Pins: newModel(mongooseConnection, 'Pins', pinsSchema),
      },
    });
    ctx.meta.userSession = { ...userSession };
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();

    assetId = 'testAssetId';
  });

  describe('Intended workload', () => {
    it('should add a pin', async () => {
      // Arrange
      checkAssetExists.mockResolvedValue(true);
      getPinByAsset.mockResolvedValue(null);

      // Act
      const result = await add({ assetId, ctx });

      const pinExpected = await ctx.tx.db.Pins.findOne({ asset: assetId });

      // Assert
      expect(checkAssetExists).toBeCalledWith({ assetId, ctx });
      expect(getPinByAsset).toBeCalledWith({ assetId, ctx });
      expect(result.asset).toEqual(assetId);
      expect(pinExpected.asset).toEqual(assetId);
    });
  });

  describe('Limit use cases', () => {
    it('should not add a pin if asset is already pinned', async () => {
      // Arrange
      checkAssetExists.mockResolvedValue(true);
      getPinByAsset.mockResolvedValue({ id: 'existingPinId' });

      // Act
      const testFunc = async () => add({ assetId, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Asset already pinned',
          httpStatusCode: 400,
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw an error if asset ID is missing', async () => {
      // Arrange
      const assetIdMissing = undefined;

      // Act
      const testFunc = async () => add({ assetId: assetIdMissing, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Asset ID is required',
          httpStatusCode: 400,
        })
      );
    });

    it('should throw an error if asset does not exist', async () => {
      // Arrange
      checkAssetExists.mockResolvedValue(false);

      // Act
      const testFunc = async () => add({ assetId, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Asset does not exist',
          httpStatusCode: 400,
        })
      );
    });
  });
});
