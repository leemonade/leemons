const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { filesSchema } = require('../../../models');
const { handleCreateFile } = require('./handleCreateFile');

let mongooseConnection;
let disconnectMongoose;

describe('Handle Create File', () => {
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

  it('Should correctly create a new file', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const fileData = {
      deploymentID: 'testDeploymentId',
      type: 'testFileType',
      extension: 'testExtension',
      name: 'testFileName',
      size: 1234,
      uri: 'testUri',
      metadata: 'testMetadata',
    };
    const pathsInfo = {
      path: 'testPath',
    };

    // Act
    const result = await handleCreateFile({ fileData, pathsInfo, ctx });

    // Assert
    expect(result).toHaveProperty('name', fileData.name);
    expect(result).toHaveProperty('type', fileData.type);
    expect(result).toHaveProperty('extension', fileData.extension);
    expect(result).toHaveProperty('metadata', JSON.stringify({ pathsInfo }));
  });

  it('Should return null if no file data is provided', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    // Assert
    await expect(handleCreateFile({ fileData: null, pathsInfo: null, ctx })).rejects.toThrow();
  });
});
