const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { finishMultipart } = require('./finishMultipart');
const { getS3AndConfig } = require('./getS3AndConfig');
const { multipartEtagSchema } = require('../../models/multipart-etag');
const { multipartUploadsSchema } = require('../../models/multipart-uploads');
const getMultiparts = require('../../__fixtures__/getMultiparts');
const getFile = require('../../__fixtures__/getFile');

jest.mock('./getS3AndConfig');

let mongooseConnection;
let disconnectMongoose;

describe('Finish S3 Multipart upload', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    getS3AndConfig.mockImplementation(() => ({
      s3: {
        completeMultipartUpload: jest.fn().mockReturnValue({
          promise: () => Promise.resolve(true),
        }),
      },
      config: {
        bucket: 'mockBucket',
      },
    }));
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
  });

  it('Should correctly finish multipart upload and return true', async () => {
    // Arrange
    const { multipartEtagModel, multipartUploadModel } = getMultiparts();
    const { file } = getFile();
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Populate the database with mock data
    await ctx.tx.db.MultipartUploads.create({ ...multipartUploadModel });
    await ctx.tx.db.MultipartEtag.create({ ...multipartEtagModel });

    // Act
    const response = await finishMultipart({ file, path, ctx });

    const multipartUploadsRecords = await ctx.tx.db.MultipartUploads.find({
      fileId: file.id,
    }).lean();

    const multipartEtagRecords = await ctx.tx.db.MultipartEtag.find({
      fileId: file.id,
    }).lean();

    // Assert
    expect(response).toBe(true);
    expect(multipartUploadsRecords).toEqual([]);
    expect(multipartEtagRecords).toEqual([]);
  });

  it('Should throw an error if no started multipart upload for this file', async () => {
    // Arrange
    const file = { uri: 'testUri', id: 'testId', isFolder: false };
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act and Assert
    await expect(finishMultipart({ file, path, ctx })).rejects.toThrow(
      'No started multipart upload for this file'
    );
  });

  it('Should throw an error if no part files sends yet', async () => {
    // Arrange
    const { multipartUploadModel } = getMultiparts();
    const { file } = getFile();
    const path = 'testPath';
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Populate the database with mock data
    await ctx.tx.db.MultipartUploads.create({ ...multipartUploadModel });

    // Act and Assert
    await expect(finishMultipart({ file, path, ctx })).rejects.toThrow('No part files sends yet');
  });
});
