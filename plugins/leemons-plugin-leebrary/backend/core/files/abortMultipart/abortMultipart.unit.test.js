const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { filesSchema } = require('../../../models');
const { abortMultipart } = require('./abortMultipart');
const getProviders = require('../../../__fixtures__/getProviders');
const { handleAbortMultipart } = require('./handleAbortMultipart');

jest.mock('./handleAbortMultipart', () => ({
  handleAbortMultipart: jest.fn(),
}));

let mongooseConnection;
let disconnectMongoose;

describe('Abort Multipart Upload', () => {
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
    handleAbortMultipart.mockReset();
  });

  it('Should correctly abort a multipart upload and delete the file from the database', async () => {
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
    const response = await abortMultipart({ fileId: file.id, ctx });

    // Assert
    expect(response).toBe(true);
    const deletedFile = await ctx.tx.db.Files.findOne({ id: file.id }).lean();
    expect(deletedFile).toBeNull();
  });

  it('Should throw an error if no file with the given id is found', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    // Act and Assert
    await expect(abortMultipart({ fileId: 'non-existent-file', ctx })).rejects.toThrow(
      'No file found'
    );
  });
});
