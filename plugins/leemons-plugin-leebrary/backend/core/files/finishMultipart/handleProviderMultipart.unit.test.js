const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { finishProviderMultipart } = require('./handleProviderMultipart');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');

jest.mock('../../providers/getByName');

let mongooseConnection;
let disconnectMongoose;

describe('Finish Provider Multipart', () => {
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
    getByName.mockClear();
  });

  it('Should correctly finish multipart for non-sys provider', async () => {
    // Arrange
    const { provider } = getProviders();
    getByName.mockResolvedValue(provider.value.params);
    const file = { provider: provider.value.pluginName, uri: 'test-uri' };
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    // Act
    await finishProviderMultipart({ file, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: file.provider, ctx });
    expect(ctx.tx.call).toHaveBeenCalledWith(`${file.provider}.files.finishMultipart`, { file });
  });

  it('Should not call provider finishMultipart if provider does not support it', async () => {
    // Arrange
    const { provider } = getProviders();
    provider.value.params.supportedMethods.finishMultipart = false;
    getByName.mockResolvedValue(provider.value.params);
    const file = { provider: provider.value.pluginName, uri: 'test-uri' };
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    // Act
    await finishProviderMultipart({ file, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: file.provider, ctx });
    expect(ctx.tx.call).not.toHaveBeenCalled();
  });
});
