const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const mime = require('mime-types');

const { upload } = require('./upload');
const { filesSchema } = require('../../../models/files');
const { handleFileProvider } = require('./handleFileProvider');
const { findOne: getSettings } = require('../../settings');
const { getMetadataObject } = require('./getMetadataObject');

jest.mock('./handleFileProvider');
jest.mock('./getMetadataObject');
jest.mock('mime-types');
jest.mock('../../settings');

let mongooseConnection;
let disconnectMongoose;

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

const fileExpectedPropertyKeys = [
  'id',
  'deploymentID',
  'provider',
  'type',
  'extension',
  'name',
  'size',
  'uri',
  'metadata',
  '_id',
  'isDeleted',
  'deletedAt',
  'createdAt',
  'updatedAt',
  '__v',
];

it('Should upload a file and return the uploaded file data', async () => {
  // Arrange
  const file = { path: '/path/to/file', type: 'image/png' };
  const name = 'testImage';
  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });
  const mockMetadata = {
    metadata: { size: '100 KB', width: '800', height: '600' },
    fileSize: 102400,
  };
  const mockSettings = { providerName: 'provider' };
  const mockUri = 'uri';

  getMetadataObject.mockResolvedValue(mockMetadata);
  handleFileProvider.mockResolvedValue({
    uri: mockUri,
    provider: mockSettings.providerName,
  });
  mime.extension.mockReturnValue('png');
  getSettings.mockResolvedValue(mockSettings);

  // Act
  const response = await upload({ file, name, ctx });
  const createdFileId = handleFileProvider.mock.calls[0][0].newFile.id; // Retrieves the DB file ID when the file is created

  // Assert
  expect(getSettings).toBeCalledWith({ ctx });
  expect(getMetadataObject).toBeCalledWith({
    filePath: file.path,
    fileType: file.type,
    extension: 'png',
  });
  expect(handleFileProvider).toHaveBeenCalledWith({
    newFile: expect.any(Object),
    settings: mockSettings,
    path: file.path,
    ctx,
  });
  fileExpectedPropertyKeys.forEach((key) => {
    expect(handleFileProvider.mock.calls[0][0].newFile).toMatchObject({
      [key]: expect.anything(),
      name,
      size: mockMetadata.fileSize,
      uri: '',
      provider: 'sys',
      deletedAt: null,
    });
  });
  expect(response.id).toBe(createdFileId);
  expect(response.uri).toBe(mockUri);
  expect(response.provider).toBe(mockSettings.providerName);
  expect(response.metadata).toEqual(mockMetadata.metadata);
});
