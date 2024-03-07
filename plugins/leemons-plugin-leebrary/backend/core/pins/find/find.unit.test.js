const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { find } = require('./find');

describe('find pin', () => {
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
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();

    assetId = 'testAssetId';
    await ctx.tx.db.Pins.create({
      asset: assetId,
      userAgent: userSession.userAgents[0].id,
    });
  });

  describe('Intended workload', () => {
    it('should find a pin', async () => {
      // Arrange

      // Act
      const result = await find({ query: { asset: assetId }, columns: ['asset'], ctx });

      // Assert
      expect(result[0].asset).toEqual(assetId);
      expect(result[0].userAgent).toBeUndefined();
    });
  });

  describe('Limit use cases', () => {
    it('should return empty array if no pin matches the query', async () => {
      // Arrange

      // Act
      const result = await find({
        query: { asset: 'nonExistingAssetId' },
        columns: ['asset'],
        ctx,
      });

      // Assert
      expect(result).toEqual([]);
    });
  });
});
