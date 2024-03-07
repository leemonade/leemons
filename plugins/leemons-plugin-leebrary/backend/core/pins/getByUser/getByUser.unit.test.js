const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getByUser } = require('./getByUser');
const { pinsSchema } = require('../../../models/pins');
const getUserSession = require('../../../__fixtures__/getUserSession');

describe('getByUser pin', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let userSession;
  let assetId;

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

    ctx.meta.userSession = { ...userSession };

    assetId = 'testAssetId';

    await ctx.tx.db.Pins.create([
      { asset: assetId, userAgent: userSession.userAgents[0].id },
      { asset: assetId, userAgent: 'otherUserAgentId' },
    ]);
  });

  describe('Intended workload', () => {
    it('should return pins only for the user agent', async () => {
      // Arrange

      // Act
      const result = await getByUser({ ctx });

      // Assert
      expect(result.length).toBe(1);
      result.forEach((pin) => {
        expect(pin.userAgent).toEqual(userSession.userAgents[0].id);
      });
    });
  });

  describe('Limit use cases', () => {
    it('should return empty array if no pin found for user agent', async () => {
      // Arrange
      await ctx.tx.db.Pins.deleteMany({});

      // Act
      const result = await getByUser({ ctx });

      // Assert
      expect(result.length).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should throw an error if user session is not available', async () => {
      // Arrange
      delete ctx.meta.userSession;

      // Act
      const testFunc = async () => getByUser({ ctx });

      // Assert
      await expect(testFunc).rejects.toThrow();
    });
  });

  describe('Additional tests', () => {
    it('should return all pins if multiple pins exist for the user agent', async () => {
      // Arrange
      await ctx.tx.db.Pins.create([
        { userAgent: userSession.userAgents[0].id },
        { userAgent: userSession.userAgents[0].id },
      ]);

      // Act
      const result = await getByUser({ ctx });

      // Assert
      expect(result.length).toBe(3);
      result.forEach((pin) => {
        expect(pin.userAgent).toEqual(userSession.userAgents[0].id);
      });
    });
  });
});
