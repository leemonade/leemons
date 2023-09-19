const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const mime = require('mime-types');
const fsPromises = require('fs/promises');

const { upload } = require('./upload');
const { filesSchema } = require('../../../models/files');
const { handleMetadata } = require('./handleMetadata');
const { handleFileProvider } = require('./handleFileProvider');
const { handleDocumentInfo } = require('./handleDocumentInfo');
const { handleMediaInfo } = require('./handleMediaInfo');
const { findOne: getSettings } = require('../../settings');

jest.mock('./handleMetadata');
jest.mock('./handleFileProvider');
jest.mock('./handleDocumentInfo');
jest.mock('./handleMediaInfo');
jest.mock('mime-types');
jest.mock('fs/promises');
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
  const fileHandle = () => {};
  const fileSize = 102400;
  const mockMetadata = {
    metadata: { size: '100 KB', width: '800', height: '600' },
    fileSize,
  };
  const mockSettings = { providerName: 'provider' };
  const mockUri = 'uri';

  fsPromises.open.mockResolvedValue(fileHandle);
  handleMetadata.mockResolvedValue({
    metadata: { size: mockMetadata.size },
    fileSize,
  });
  handleMediaInfo.mockResolvedValue({ ...mockMetadata.metadata });
  handleDocumentInfo.mockResolvedValue({ ...mockMetadata.metadata });
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
  expect(handleMetadata).toHaveBeenCalledWith({ fileHandle, path: file.path });
  expect(handleMediaInfo).toHaveBeenCalledWith({
    metadata: { size: mockMetadata.size },
    fileHandle,
    fileType: 'image',
    fileSize: mockMetadata.fileSize,
    ctx,
  });
  expect(handleDocumentInfo).toHaveBeenCalledWith({
    metadata: mockMetadata.metadata,
    path: file.path,
    extension: 'png',
  });
  expect(getSettings).toBeCalledWith({ ctx });
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
      size: fileSize,
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
