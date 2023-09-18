const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const { removeByAsset } = require('./removeByAsset');
const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');

jest.mock('../getByAsset');
const { getByAsset: getPinByAsset } = require('../getByAsset');

describe('removeByAsset pin', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;

  const userSession = getUserSession();
  const assetId = 'testAssetId';
  const pins = [
    { id: 'pinId1', asset: assetId, userAgent: userSession.userAgents[0].id },
    { id: 'pinId2', asset: assetId, userAgent: 'otherUserAgentId' },
  ];

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

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

    await ctx.tx.db.Pins.create(pins);
  });

  describe('Intended workload', () => {
    it('should remove a pin', async () => {
      // Arrange
      getPinByAsset.mockResolvedValue(pins[0]);

      // Act
      const result = await removeByAsset({ assetId, ctx });

      const afterRemovePins = await ctx.tx.db.Pins.find(
        {
          asset: assetId,
          userAgent: userSession.userAgents[0].id,
        },
        {},
        { excludeDeleted: false }
      );

      // Assert
      expect(getPinByAsset).toBeCalledWith({ assetId, ctx });
      expect(result).toEqual({ acknowledged: true, deletedCount: 1 });

      expect(afterRemovePins).toHaveLength(0);
    });

    it('should SOFT remove a pin', async () => {
      // Arrange
      getPinByAsset.mockResolvedValue(pins[0]);

      // Act

      const result = await removeByAsset({ assetId, soft: true, ctx });

      const afterRemovePins = await ctx.tx.db.Pins.find(
        { asset: assetId, userAgent: userSession.userAgents[0].id },
        {},
        { excludeDeleted: false }
      );

      // Assert
      expect(getPinByAsset).toBeCalledWith({ assetId, ctx });
      expect(result.modifiedCount).toBe(1);

      expect(afterRemovePins).toHaveLength(1);
      expect(afterRemovePins[0].isDeleted).toBe(true);
    });
  });

  describe('Limit use cases', () => {
    it('should not remove a pin if pin does not exist', async () => {
      // Arrange
      getPinByAsset.mockResolvedValue(null);

      // Act
      const testFunc = async () => removeByAsset({ assetId, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Pin not found',
          httpStatusCode: 404,
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw an error if asset ID is missing', async () => {
      // Arrange
      const assetIdMissing = undefined;

      // Act
      const testFunc = async () => removeByAsset({ assetId: assetIdMissing, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Pin not found',
          httpStatusCode: 404,
        })
      );
    });

    it('should throw an error if failed to remove pin', async () => {
      // Arrange
      getPinByAsset.mockResolvedValue({ id: 'existingPinId' });
      ctx.tx.db.Pins.deleteOne = jest.fn().mockRejectedValue(new Error());

      // Act
      const testFunc = async () => removeByAsset({ assetId, ctx });

      // Assert
      await expect(testFunc).rejects.toThrow(
        new LeemonsError(ctx, {
          message: 'Failed to remove Pin',
          httpStatusCode: 500,
        })
      );
    });
  });
});
