const { it, expect, describe, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleExistence } = require('./handleExistence');

const ctx = generateCtx({});

jest.mock('../../../files/exists');
jest.mock('../../exists');

const { exists: fileExists } = require('../../../files/exists');
const { exists: assetExists } = require('../../exists');

beforeEach(() => jest.resetAllMocks());

describe('handleExistence', () => {
  it('should throw an error if file does not exist', async () => {
    // Arrange
    fileExists.mockResolvedValue(false);
    const spyLogger = jest.spyOn(ctx.logger, 'info');

    // Act
    const testFn = async () => {
      await handleExistence({ fileId: '123', assetId: '456', ctx });
    };

    // Assert
    await expect(testFn()).rejects.toEqual(
      expect.objectContaining({
        message: 'File not found',
        httpStatusCode: 422,
      })
    );
    expect(spyLogger).toHaveBeenCalledWith('ERROR fileId:', '123');
  });

  it('should throw an error if asset does not exist', async () => {
    // Arrange
    fileExists.mockResolvedValue(true);
    assetExists.mockResolvedValue(false);

    // Act
    const testFn = async () => {
      await handleExistence({ fileId: '123', assetId: '456', ctx });
    };

    // Assert
    await expect(testFn()).rejects.toEqual(
      expect.objectContaining({
        message: 'Asset not found',
        httpStatusCode: 422,
      })
    );
  });

  it('should not throw an error if file and asset exist', async () => {
    // Arrange
    fileExists.mockResolvedValue(true);
    assetExists.mockResolvedValue(true);

    // Act
    const testFn = async () => {
      await handleExistence({ fileId: '123', assetId: '456', ctx });
    };

    // Assert
    await expect(testFn()).resolves.toBeUndefined();
  });
});
