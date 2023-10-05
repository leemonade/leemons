const {
  it,
  expect,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const fs = require('fs');
const { handleReadStream } = require('./handleReadStream');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');
const getFile = require('../../../__fixtures__/getFile');

jest.mock('../../providers/getByName');

let mongooseConnection;
let disconnectMongoose;

describe('Handle Read Stream', () => {
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
    jest.spyOn(fs, 'createReadStream').mockImplementation(jest.fn());
  });

  afterEach(() => {
    getByName.mockClear();
    fs.createReadStream.mockClear();
  });

  it('Should correctly handle read stream for sys provider', async () => {
    // Arrange
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    const { file } = getFile();
    file.provider = 'sys';

    const path = 'test-path';

    // Mock fs.createReadStream to return a stream
    fs.createReadStream = jest.fn().mockReturnValue({});

    // Act
    const readStream = await handleReadStream({ file, path, ctx });

    // Assert
    expect(fs.createReadStream).toHaveBeenCalledWith(`${file.uri}/${path}`, undefined);
    expect(readStream).not.toBeNull();
  });

  it('Should correctly handle read stream for non-sys provider', async () => {
    // Arrange
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    const { provider } = getProviders();
    getByName.mockResolvedValue(provider.value.params);
    const { file } = getFile();
    file.provider = provider.value.pluginName;

    const path = 'test-path';

    // Act
    await handleReadStream({ file, path, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: file.provider, ctx });
    expect(ctx.tx.call).toHaveBeenCalledWith(`${file.provider}.files.getReadStream`, {
      key: `${file.uri}/${path}`,
      start: undefined,
      end: undefined,
      forceStream: undefined,
    });
  });

  it('Should return undefined when provider does not support getReadStream method', async () => {
    // Arrange
    const ctx = generateCtx({});
    ctx.tx.call = jest.fn(); // Mock ctx.call

    const { provider } = getProviders();
    provider.value.params.supportedMethods.getReadStream = false;
    getByName.mockResolvedValue(provider.value.params);
    const { file } = getFile();
    file.provider = provider.value.pluginName;

    const path = 'test-path';

    // Act
    const readStream = await handleReadStream({ file, path, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: file.provider, ctx });
    expect(readStream).toBeNull();
  });
});
