const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const fs = require('fs/promises');
const { handleAbortMultipart } = require('./handleAbortMultipart');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');

jest.mock('../../providers/getByName');
jest.mock('fs/promises');

let mongooseConnection;
let disconnectMongoose;

describe('Handle Abort Multipart', () => {
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
    fs.rmdir.mockClear();
    fs.unlink.mockClear();
  });

  it('Should correctly handle abort multipart for non-sys provider', async () => {
    // Arrange
    const { provider } = getProviders();
    getByName.mockResolvedValue(provider.value.params);
    const file = { provider: provider.value.pluginName, uri: 'test-uri' };
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    // Act
    await handleAbortMultipart({ file, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith(file.provider);
    expect(ctx.tx.call).toHaveBeenCalledWith(`${file.provider}.provider.abortMultipart`, { file });
  });

  it('Should correctly handle abort multipart for sys provider and isFolder is true', async () => {
    // Arrange
    const ctx = generateCtx({});
    const file = { provider: 'sys', uri: 'test-uri', isFolder: true };

    // Act
    await handleAbortMultipart({ file, ctx });

    // Assert
    expect(fs.rmdir).toHaveBeenCalledWith(file.uri, { recursive: true });
  });

  it('Should correctly handle abort multipart for sys provider and isFolder is false', async () => {
    // Arrange
    const ctx = generateCtx({});
    const file = { provider: 'sys', uri: 'test-uri', isFolder: false };

    // Act
    await handleAbortMultipart({ file, ctx });

    // Assert
    expect(fs.unlink).toHaveBeenCalledWith(file.uri);
  });
});
