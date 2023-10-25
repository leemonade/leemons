const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { newMultipart } = require('./newMultipart');
const { getS3AndConfig } = require('./getS3AndConfig');
const { multipartEtagSchema } = require('../../models/multipart-etag');
const { multipartUploadsSchema } = require('../../models/multipart-uploads');
const getFiles = require('../../__fixtures__/getFile');

jest.mock('./getS3AndConfig');

let mongooseConnection;
let disconnectMongoose;

describe('New S3 Multipart upload', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    getS3AndConfig.mockImplementation(() => ({
      s3: {
        uploadPart: jest.fn().mockReturnValue({
          promise: () => Promise.resolve(true),
        }),
        completeMultipartUpload: jest.fn().mockReturnValue({
          promise: () => Promise.resolve(true),
        }),
        createMultipartUpload: jest.fn().mockReturnValue({
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

  it('Should correctly create a multipart upload for a file and return the key', async () => {
    // Arrange
    const {
      file: { id: fileId, isFolder: fileIsFolder, extension: fileExtension },
      filePaths,
    } = getFiles();

    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act
    const response = await newMultipart({
      file: { id: fileId, isFolder: fileIsFolder, extension: fileExtension },
      filePaths,
      ctx,
    });

    const foundAsset = await ctx.tx.db.MultipartUploads.findOne({ fileId }).lean();

    // Assert
    expect(fileId).toEqual(foundAsset.fileId);
    expect(response).toEqual(`leemons/leebrary/${fileId}.${fileExtension}`);
  });

  it('Should correctly create multipart uploads for a folder and return the key', async () => {
    // Arrange
    const {
      folder: { id: folderId, isFolder: folderIsFolder },
      filePaths,
    } = getFiles();

    const ctx = generateCtx({
      models: {
        MultipartUploads: newModel(mongooseConnection, 'MultipartUploads', multipartUploadsSchema),
        MultipartEtag: newModel(mongooseConnection, 'MultipartEtag', multipartEtagSchema),
      },
    });

    // Act
    const response = await newMultipart({
      file: { id: folderId, isFolder: folderIsFolder },
      filePaths,
      ctx,
    });

    // Assert
    expect(response).toEqual(`leemons/leebrary/${folderId}`);
  });
});
