const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { keyValueSchema } = require('leemons-mongodb-helpers');
const { list } = require('./list');
const getProviders = require('../../__fixtures__/getProviders');

let mongooseConnection;
let disconnectMongoose;

describe('List Plugin Providers', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
  });

  it('Should correctly list all plugin providers', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        KeyValue: newModel(mongooseConnection, 'KeyValue', keyValueSchema),
      },
    });
    const { provider } = getProviders();

    // Act
    await ctx.tx.db.KeyValue.create(provider);
    const response = await list({ ctx });

    // Assert
    expect(response).toBeInstanceOf(Array);
    expect(response[0].pluginName).toEqual(provider.value.pluginName);
  });

  it('Should return an empty array if no providers are available', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        KeyValue: newModel(mongooseConnection, 'KeyValue', keyValueSchema),
      },
    });

    // Act
    const response = await list({ ctx });

    // Assert
    expect(response).toEqual([]);
  });
});
