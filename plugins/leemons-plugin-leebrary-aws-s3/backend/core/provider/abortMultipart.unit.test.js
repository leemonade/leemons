const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { abortMultipart } = require('./abortMultipart');
const { getS3AndConfig } = require('./getS3AndConfig');
const { multipartEtagSchema } = require('../../models/multipart-etag');
const { multipartUploadsSchema } = require('../../models/multipart-uploads');
const getMultiparts = require('../../__fixtures__/getMultiparts');
const getFile = require('../../__fixtures__/getFile');

jest.mock('./getS3AndConfig');

let mongooseConnection;
let disconnectMongoose;

describe('Abort S3 Multipart upload', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    getS3AndConfig.mockImplementation(() => ({
      s3: {
        abortMultipartUpload: jest.fn().mockReturnValue({
          promise: () => Promise.resolve({ UploadId: 'mock UploadId' }),
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

  it('Should correctly abort a multipart upload and return true', async () => {
    // Arrange
    const { multipartUploadModel, multipartEtagModel } = getMultiparts();
    const { file } = getFile();

    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act
    await ctx.tx.db.MultipartUploads.create({ ...multipartUploadModel });
    await ctx.tx.db.MultipartEtag.create({ ...multipartEtagModel });

    const response = await abortMultipart({
      file,
      ctx,
    });

    const foundMultipartUpload = await ctx.tx.db.MultipartUploads.findOne({
      fileId: multipartUploadModel.fileId,
    }).lean();

    const foundMultipartEtag = await ctx.tx.db.MultipartEtag.findOne({
      fileId: multipartUploadModel.fileId,
    }).lean();

    // Assert
    expect(response).toBe(true);
    expect(foundMultipartUpload).toBeNull();
    expect(foundMultipartEtag).toBeNull();
  });

  it('Should throw an error when no multipart upload is found for the given file', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    const file = {
      id: 'nonexistent',
    };

    // Act and Assert
    await expect(abortMultipart({ file, ctx })).rejects.toThrow(
      'No started multipart upload for this file'
    );
  });
});
