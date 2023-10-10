const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { handleCloneFile } = require('./handleCloneFile');
const { filesSchema } = require('../../../models');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');

jest.mock('../../providers/getByName');

let mongooseConnection;
let disconnectMongoose;

describe('Handle Clone File', () => {
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

  it('Should correctly handle clone file for provider with clone method', async () => {
    // Arrange
    const { provider } = getProviders();
    getByName.mockResolvedValue(provider.value.params);
    const fromFileData = {
      provider: provider.value.pluginName,
      id: 'testFileId',
      name: 'testFileName',
      type: 'testFileType',
      uri: 'testFileUrl',
      extension: 'testExtension',
    };
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const fromFile = (await ctx.tx.db.Files.create(fromFileData)).toObject();
    ctx.tx.call = jest.fn(); // Mock ctx.call

    // Act
    await handleCloneFile({ fromFile, providerName: fromFile.provider, ctx });
    const newFile = await ctx.tx.db.Files.findOne({ id: { $ne: fromFile.id } }).lean();

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: fromFile.provider, ctx });
    expect(ctx.tx.call).toHaveBeenCalledWith(
      `${fromFile.provider}.files.clone`,
      expect.objectContaining({
        itemFrom: fromFile,
        itemTo: expect.objectContaining({
          id: newFile.id,
        }),
      })
    );
  });

  it('Should return null for provider without clone method', async () => {
    // Arrange
    const { provider } = getProviders();
    provider.value.params.supportedMethods.clone = false;
    getByName.mockResolvedValue(provider.value.params);
    const fromFile = { provider: provider.value.pluginName, uri: 'test-uri' };
    const ctx = generateCtx({});

    // Act
    const result = await handleCloneFile({ fromFile, providerName: fromFile.provider, ctx });

    // Assert
    expect(result).toBeNull();
  });
});
