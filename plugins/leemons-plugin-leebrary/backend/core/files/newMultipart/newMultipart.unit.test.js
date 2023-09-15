const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { filesSchema } = require('../../../models');
const { newMultipart } = require('./newMultipart');
const { handleFileProvider } = require('./handleFileProvider');
const { handleFileSystem } = require('./handleFileSystem');
const { findOne } = require('../../settings');
const getProviders = require('../../../__fixtures__/getProviders');

jest.mock('./handleFileProvider');
jest.mock('./handleFileSystem');
jest.mock('./../../settings');

let mongooseConnection;
let disconnectMongoose;

describe('New Multipart', () => {
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

  it('Should correctly create a new multipart file', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const { provider } = getProviders();
    const settings = { providerName: provider.value.pluginName };

    const fileData = {
      name: 'testFileName',
      type: 'application/pdf',
      size: 1234,
      isFolder: false,
      filePaths: ['testPath1', 'testPath2'],
      pathsInfo: {
        path: 'testPath',
      },
    };
    handleFileProvider.mockResolvedValue(fileData);
    handleFileSystem.mockResolvedValue(fileData);
    findOne.mockResolvedValue(settings);

    // Act
    const result = await newMultipart({ ...fileData, ctx });
    const fileCreated = await ctx.tx.db.Files.findOne({ name: result.name }).lean();

    // Assert
    expect(fileCreated.id).toBeDefined();
    expect(fileCreated).toHaveProperty('provider', 'sys');
    expect(fileCreated).toHaveProperty('name', fileData.name);
    expect(fileCreated).toHaveProperty('type', fileData.type);
    expect(fileCreated).toHaveProperty('size', fileData.size);
  });

  it('Should throw an error if no file data is provided', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    // Assert
    await expect(
      newMultipart({
        name: null,
        type: null,
        size: null,
        isFolder: null,
        filePaths: null,
        pathsInfo: null,
        ctx,
      })
    ).rejects.toThrow();
  });
});
