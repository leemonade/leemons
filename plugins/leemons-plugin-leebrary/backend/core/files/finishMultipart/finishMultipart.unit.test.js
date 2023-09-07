const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { filesSchema } = require('../../../models');
const { finishMultipart } = require('./finishMultipart');
const getProviders = require('../../../__fixtures__/getProviders');
const { handleProviderMultipart } = require('./handleProviderMultipart');

jest.mock('./handleProviderMultipart', () => ({
  handleProviderMultipart: jest.fn(),
}));

let mongooseConnection;
let disconnectMongoose;

describe('Finish Multipart Upload', () => {
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
    handleProviderMultipart.mockReset();
  });

  it('Should correctly finish a multipart upload for a non-sys provider', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const { provider } = getProviders();
    const fileData = {
      id: 'testFileId',
      name: 'testFileName',
      type: 'testFileType',
      uri: 'testFileUrl',
      extension: 'testExtension',
      provider: provider.value.pluginName,
    };
    const file = await ctx.tx.db.Files.create(fileData);

    // Act
    const response = await finishMultipart({ fileId: file.id, path: 'testPath', ctx });

    // Assert
    expect(response).toBe(true);
    expect(handleProviderMultipart).toHaveBeenCalledWith({
      file: file.toObject(),
      path: 'testPath',
      ctx,
    });
  });

  it('Should throw an error if no file with the given id is found', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    // Act and Assert
    await expect(
      finishMultipart({ fileId: 'non-existent-file', path: 'testPath', ctx })
    ).rejects.toThrow('No file found');
  });

  it('Should not call handleProviderMultipart for sys provider', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const fileData = {
      id: 'testFileId',
      name: 'testFileName',
      type: 'testFileType',
      uri: 'testFileUrl',
      extension: 'testExtension',
      provider: 'sys',
    };
    const file = await ctx.tx.db.Files.create(fileData);

    // Act
    await finishMultipart({ fileId: file.id, path: 'testPath', ctx });

    // Assert
    expect(handleProviderMultipart).not.toHaveBeenCalled();
  });
});
