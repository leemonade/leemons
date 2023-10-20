const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');

const { newModel } = require('@leemons/mongodb');

const { getByAsset } = require('./getByAsset');
const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');

describe('getByAsset pin', () => {
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
        Pins: newModel(mongooseConnection, 'Pins', pinsSchema),
      },
    });

    assetId = 'testAssetId';
    await ctx.tx.db.Pins.create([
      {
        asset: assetId,
        userAgent: userSession.userAgents[0].id,
      },
      {
        asset: assetId,
        userAgent: 'otherUserAgentId',
      },
      {
        asset: 'otherAssetId',
        userAgent: userSession.userAgents[0].id,
      },
    ]);
  });

  describe('Intended workload', () => {
    it('should get a pin by asset ID', async () => {
      // Arrange
      ctx.meta.userSession = userSession;
      // Act
      const result = await getByAsset({ assetId, ctx });

      // Asser
      expect(result.asset).toBe(assetId);
    });
    it('should get a pin array by asset ID and no userSession is in ctx.meta', async () => {
      // Arrange
      delete ctx.meta.userSession;
      // Act
      const result = await getByAsset({ assetId, ctx });

      // Assert
      expect(result.length).toBe(2);
      result.forEach((res) => {
        expect(res.asset).toBe(assetId);
      });
    });
  });

  describe('Limit use cases', () => {
    it('should return null if no pin found for asset ID', async () => {
      // Arrange
      const nonExistentAssetId = 'nonExistentAssetId';
      ctx.meta.userSession = userSession;

      // Act
      const result = await getByAsset({ assetId: nonExistentAssetId, ctx });

      // Assert
      expect(result).toBeNull();
    });

    it('should return an empty array if no pin found for asset ID and no userSession is in ctx.meta', async () => {
      // Arrange
      const nonExistentAssetId = 'nonExistentAssetId';
      ctx.meta.userSession = undefined;

      // Act
      const result = await getByAsset({ assetId: nonExistentAssetId, ctx });

      // Assert
      expect(result).toEqual([]);
    });
  });
});
