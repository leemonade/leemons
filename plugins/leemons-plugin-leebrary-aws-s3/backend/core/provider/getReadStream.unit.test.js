const { it, expect, describe, beforeEach } = require('@jest/globals');
const aws = require('aws-sdk');
const { getReadStream } = require('./getReadStream');
const { getS3AndConfig } = require('./getS3AndConfig');

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    getObject: jest.fn().mockImplementation(() => ({
      promise: jest.fn(),
    })),
    getSignedUrl: jest.fn(),
  })),
}));

jest.mock('./getS3AndConfig', () => ({
  getS3AndConfig: jest.fn(),
}));

describe('Get S3 ReadStream', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a read stream when forceStream is true', async () => {
    // Arrange
    const ctx = {};
    const key = 'testKey';
    const start = 0;
    const end = 100;
    const forceStream = true;
    const config = { bucket: 'testBucket' };
    const s3 = new aws.S3();
    getS3AndConfig.mockResolvedValue({ s3, config });
    s3.getObject = jest.fn().mockImplementation(() => ({
      promise: jest.fn(),
    }));

    // Act
    await getReadStream({ key, start, end, forceStream, ctx });

    // Assert
    expect(getS3AndConfig).toHaveBeenCalledWith({ ctx });
    expect(s3.getObject).toHaveBeenCalledWith({
      Bucket: config.bucket,
      Key: key,
      Range: `bytes=${start}-${end}`,
    });
  });

  it('should return a presigned URL when forceStream is false', async () => {
    // Arrange
    const ctx = {};
    const key = 'testKey';
    const start = 0;
    const end = 100;
    const forceStream = false;
    const config = { bucket: 'testBucket' };
    const s3 = new aws.S3();
    getS3AndConfig.mockResolvedValue({ s3, config });
    s3.getSignedUrl = jest.fn();

    // Act
    await getReadStream({ key, start, end, forceStream, ctx });

    // Assert
    expect(getS3AndConfig).toHaveBeenCalledWith({ ctx });
    expect(s3.getSignedUrl).toHaveBeenCalledWith('getObject', {
      Bucket: config.bucket,
      Key: key,
      Expires: 60 * 5,
      Range: 'bytes=0-100',
    });
  });
});
