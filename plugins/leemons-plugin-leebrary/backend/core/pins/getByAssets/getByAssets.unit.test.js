const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByAssets } = require('./getByAssets');
const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');

describe('getByAssets', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let userSession;
  let assetId;
  let pins;

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    userSession = getUserSession();
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();

    assetId = 'assetId';

    ctx = generateCtx({
      models: {
        Pins: newModel(mongooseConnection, 'Pins', pinsSchema),
      },
    });
    ctx.meta.userSession = { ...userSession };

    pins = await ctx.tx.db.Pins.create([
      { asset: assetId, userAgent: 'otherUserAgentId' },
      { asset: assetId, userAgent: userSession.userAgents[0].id },
    ]);
  });

  describe('Intended workload', () => {
    it('should return pins only for the user agent', async () => {
      // Arrange

      // Act
      const result = await getByAssets({ assetIds: assetId, ctx });

      // Assert
      expect(result.length).toBe(1);
      result.forEach((pin) => {
        expect(pin.userAgent).toEqual(userSession.userAgents[0].id);
      });
    });
    it('should get pins by asset IDs for all user agents', async () => {
      // Arrange
      delete ctx.meta.userSession;
      // Act
      const result = await getByAssets({ assetIds: assetId, ctx });

      // Assert
      expect(result.length).toBe(2);
      result.forEach((pin, index) => {
        expect(pin.asset).toEqual(pins[index].asset);
      });
    });
  });

  describe('Limit use cases', () => {
    it('should return empty array if no pin found for asset IDs', async () => {
      // Arrange
      const nonExistentAssetIds = ['nonExistentAssetId1', 'nonExistentAssetId2'];

      // Act
      const result = await getByAssets({ assetIds: nonExistentAssetIds, ctx });

      // Assert
      expect(result).toEqual([]);
    });
  });
});
