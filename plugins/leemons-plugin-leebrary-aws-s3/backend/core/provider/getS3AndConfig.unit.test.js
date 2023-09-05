const { it, expect, describe, afterEach } = require('@jest/globals');
const { getS3AndConfig } = require('./getS3AndConfig');
const getConfig = require('./getConfig');

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    accessKeyId: 'mockAccessKeyId',
    secretAccessKey: 'mockSecretAccessKey',
    region: 'mockRegion',
  })),
}));

jest.mock('./getConfig', () => ({
  getConfig: jest.fn(() =>
    Promise.resolve({
      accessKey: 'mockAccessKey',
      secretAccessKey: 'mockSecretAccessKey',
      region: 'mockRegion',
    })
  ),
}));

afterEach(() => jest.resetAllMocks());

describe('getS3AndConfig', () => {
  it('should return an object with s3 and config if config exists', async () => {
    // Arrange
    const ctx = {};

    // Act
    const result = await getS3AndConfig({ ctx });

    // Assert
    expect(result).toEqual({
      s3: {
        accessKeyId: 'mockAccessKeyId',
        secretAccessKey: 'mockSecretAccessKey',
        region: 'mockRegion',
      },
      config: {
        accessKey: 'mockAccessKey',
        secretAccessKey: 'mockSecretAccessKey',
        region: 'mockRegion',
      },
    });
  });

  it('should return null if config does not exist', async () => {
    // Arrange
    const ctx = {};
    getConfig.getConfig.mockImplementationOnce(() => Promise.resolve(null));

    // Act
    const result = await getS3AndConfig({ ctx });

    // Assert
    expect(result).toBeNull();
  });
});
