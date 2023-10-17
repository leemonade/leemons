const { it, expect, describe, beforeEach } = require('@jest/globals');
const { clone } = require('./clone');
const { getS3AndConfig } = require('./getS3AndConfig');

jest.mock('./getS3AndConfig');

describe('Clone S3 File', () => {
  let mockS3;
  let mockConfig;
  let mockItemFrom;
  let mockItemTo;

  beforeEach(() => {
    mockS3 = {
      copyObject: jest.fn().mockReturnValue({
        promise: jest.fn(),
      }),
    };
    mockConfig = {
      bucket: 'testBucket',
    };
    mockItemFrom = {
      id: '123',
      extension: 'jpg',
    };
    mockItemTo = {
      id: '456',
      extension: 'png',
    };

    getS3AndConfig.mockResolvedValue({
      s3: mockS3,
      config: mockConfig,
    });
  });

  it('should call getS3AndConfig with correct parameters', async () => {
    // Arrange
    const ctx = {};
    const expectedParams = { ctx };

    // Act
    await clone({ itemFrom: mockItemFrom, itemTo: mockItemTo, ctx });

    // Assert
    expect(getS3AndConfig).toHaveBeenCalledWith(expectedParams);
  });

  it('should call copyObject with correct parameters', async () => {
    // Arrange
    const ctx = {};
    const expectedParams = {
      CopySource: `${mockConfig.bucket}/leemons/leebrary/${mockItemFrom.id}.${mockItemFrom.extension}`,
      Bucket: mockConfig.bucket,
      Key: `leemons/leebrary/${mockItemTo.id}.${mockItemTo.extension}`,
    };

    // Act
    await clone({ itemFrom: mockItemFrom, itemTo: mockItemTo, ctx });

    // Assert
    expect(mockS3.copyObject).toHaveBeenCalledWith(expectedParams);
  });

  it('should return the correct key', async () => {
    // Arrange
    const ctx = {};
    const expectedKey = `leemons/leebrary/${mockItemTo.id}.${mockItemTo.extension}`;

    // Act
    const result = await clone({ itemFrom: mockItemFrom, itemTo: mockItemTo, ctx });

    // Assert
    expect(result).toEqual(expectedKey);
  });
});
