const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { uploadMultipartChunk } = require('./uploadMultipartChunk');
const { multipartEtagSchema } = require('../../models/multipart-etag');
const { multipartUploadsSchema } = require('../../models/multipart-uploads');
const { getS3AndConfig } = require('./getS3AndConfig');

jest.mock('./getS3AndConfig');

let mongooseConnection;
let disconnectMongoose;

describe('Upload S3 Multipart Chunk', () => {
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

  it('Should correctly upload multipart chunk and return true', async () => {
    // Arrange
    const file = { uri: 'testUri', id: 'testId', isFolder: false };
    const partNumber = 1;
    const buffer = Buffer.from('test data');
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Populate the MultipartUploads model with a record for the test
    await ctx.tx.db.MultipartUploads.create({
      id: 'testId',
      deploymentID: 'testDeploymentId',
      fileId: file.id,
      uploadId: 'testUploadId',
    });

    getS3AndConfig.mockResolvedValue({
      s3: {
        uploadPart: () => ({
          promise: () => Promise.resolve({ ETag: 'mockEtag' }),
        }),
      },
      config: { bucket: 'testBucket' },
    });

    // Act
    const response = await uploadMultipartChunk({ file, partNumber, buffer, path, ctx });

    // Assert
    expect(response).toBe(true);
  });

  it('Should throw an error if no started multipart upload for this file', async () => {
    // Arrange
    const file = { uri: 'testUri', id: 'testId', isFolder: false };
    const partNumber = 1;
    const buffer = Buffer.from('test data');
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act and Assert
    await expect(uploadMultipartChunk({ file, partNumber, buffer, path, ctx })).rejects.toThrow(
      'No started multipart upload for this file'
    );
  });

  it('Should correctly upload multipart chunk for a folder and return true', async () => {
    // Arrange
    const file = { uri: 'testUri', id: 'testId', isFolder: true };
    const partNumber = 1;
    const buffer = Buffer.from('test data');
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Populate the MultipartUploads model with a record for the test
    await ctx.tx.db.MultipartUploads.create({
      id: 'testId',
      deploymentID: 'testDeploymentId',
      fileId: file.id,
      uploadId: 'testUploadId',
      path: 'testPath',
    });

    getS3AndConfig.mockResolvedValue({
      s3: {
        uploadPart: () => ({
          promise: () => Promise.resolve({ ETag: 'mockEtag' }),
        }),
      },
      config: { bucket: 'testBucket' },
    });

    // Act
    const response = await uploadMultipartChunk({ file, partNumber, buffer, path, ctx });

    // Assert
    expect(response).toBe(true);
  });

  it('Should throw an error if no started multipart upload for this folder', async () => {
    // Arrange
    const file = { uri: 'testUri', id: 'testId', isFolder: true };
    const partNumber = 1;
    const buffer = Buffer.from('test data');
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act and Assert
    await expect(uploadMultipartChunk({ file, partNumber, buffer, path, ctx })).rejects.toThrow(
      'No started multipart upload for this file'
    );
  });
});
