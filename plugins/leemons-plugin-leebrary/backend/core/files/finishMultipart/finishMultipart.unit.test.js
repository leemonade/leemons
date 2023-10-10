const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { filesSchema } = require('../../../models');
const { finishMultipart } = require('./finishMultipart');
const getProviders = require('../../../__fixtures__/getProviders');
const { finishProviderMultipart: handleProviderMultipart } = require('./handleProviderMultipart');
const { dataForReturnFile } = require('../dataForReturnFile');
const { createTemp } = require('../upload/createTemp');
const { getMetadataObject } = require('../upload/getMetadataObject');

jest.mock('./handleProviderMultipart');
jest.mock('../dataForReturnFile');
jest.mock('../upload/createTemp');
jest.mock('../upload/getMetadataObject');

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
    jest.resetAllMocks();
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
      metadata: JSON.stringify({ pathInfo: '' }),
    };
    const file = await ctx.tx.db.Files.create(fileData);
    const createTempResponse = { path: 'testPath' };
    const mockMetadata = { width: '300', height: '300' };

    dataForReturnFile.mockResolvedValue({ contentType: fileData.type, readStream: [] });
    createTemp.mockResolvedValue(createTempResponse);
    getMetadataObject.mockResolvedValue({ metadata: mockMetadata });

    // Act
    const response = await finishMultipart({ fileId: file.id, path: 'testPath', ctx });

    // Assert
    expect(response).toBe(true);
    expect(handleProviderMultipart).toHaveBeenCalledWith({
      file: file.toObject(),
      path: 'testPath',
      ctx,
    });
    expect(dataForReturnFile).toBeCalledWith({ id: fileData.id, ctx });
    expect(createTemp).toBeCalledWith({ readStream: [], contentType: fileData.type });
    expect(getMetadataObject).toBeCalledWith({
      filePath: createTempResponse.path,
      fileType: fileData.type,
      extension: fileData.extension,
      ctx,
    });
    const finalFile = await ctx.tx.db.Files.findOne({ id: fileData.id }).lean();
    expect(finalFile.metadata).toEqual(JSON.stringify(mockMetadata));
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

    const createTempResponse = { path: 'testPath' };
    const mockMetadata = { width: '300', height: '300' };

    dataForReturnFile.mockResolvedValue({ contentType: fileData.type, readStream: [] });
    createTemp.mockResolvedValue(createTempResponse);
    getMetadataObject.mockResolvedValue({ metadata: mockMetadata });

    // Act
    await finishMultipart({ fileId: file.id, path: 'testPath', ctx });

    // Assert
    expect(handleProviderMultipart).not.toHaveBeenCalled();
  });

  it('Should not get metadata for folder files, yet', async () => {
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
      isFolder: true,
      provider: 'testProvider',
    };
    const file = await ctx.tx.db.Files.create(fileData);

    // Act
    await finishMultipart({ fileId: file.id, path: 'testPath', ctx });

    // Assert
    expect(dataForReturnFile).not.toHaveBeenCalled();
    expect(createTemp).not.toHaveBeenCalled();
    expect(getMetadataObject).not.toHaveBeenCalled();
  });
});
