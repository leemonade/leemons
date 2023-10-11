const { it, expect, describe, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { duplicate } = require('./duplicate');
const { handleCloneFile } = require('./handleCloneFile');
const { dataForReturnFile } = require('../dataForReturnFile');
const { uploadFromSource } = require('../helpers/uploadFromSource');
const { findOne } = require('../../settings');

jest.mock('./handleCloneFile');
jest.mock('../dataForReturnFile');
jest.mock('../helpers/uploadFromSource');
jest.mock('./../../settings');

describe('duplicate function', () => {
  beforeEach(() => {
    handleCloneFile.mockClear();
    dataForReturnFile.mockClear();
    uploadFromSource.mockClear();
  });

  it('should call handleCloneFile with correct params when providerName is present', async () => {
    // Arrange
    const ctx = generateCtx({});
    const mockFile = { id: '123', name: 'testFile' };
    const mockProviderName = 'testProvider';
    const settings = { providerName: mockProviderName };
    findOne.mockResolvedValue(settings);

    // Act
    await duplicate({ file: mockFile, providerName: mockProviderName, ctx });

    // Assert
    expect(handleCloneFile).toHaveBeenCalledWith({
      fromFile: mockFile,
      providerName: mockProviderName,
      ctx,
    });
  });

  it('should call dataForReturnFile and uploadFromSource with correct params when providerName is not present', async () => {
    // Arrange
    const ctx = generateCtx({});
    const mockFile = { id: '123', name: 'testFile' };
    const mockData = { source: 'testSource', name: 'testName' };

    dataForReturnFile.mockResolvedValue(mockData);

    // Act
    await duplicate({ file: mockFile, ctx });

    // Assert
    expect(dataForReturnFile).toHaveBeenCalledWith({ id: mockFile.id, ctx });
    expect(uploadFromSource).toHaveBeenCalledWith({
      source: mockData,
      name: mockFile.name,
      ctx,
    });
  });

  it('should return newFile and check if handleCloneFile is called with correct params when it returns a file', async () => {
    // Arrange
    const ctx = generateCtx({});
    const mockFile = { id: '123', name: 'testFile' };
    const mockProviderName = 'testProvider';
    const settings = { providerName: mockProviderName };
    const newFile = { id: '456', name: 'newFile' };

    findOne.mockResolvedValue(settings);
    handleCloneFile.mockResolvedValue(newFile);

    // Act
    const result = await duplicate({ file: mockFile, providerName: mockProviderName, ctx });

    // Assert
    expect(handleCloneFile).toHaveBeenCalledWith({
      fromFile: mockFile,
      providerName: mockProviderName,
      ctx,
    });
    expect(result).toEqual(newFile);
  });

  it('should call dataForReturnFile and uploadFromSource when providerName is null or undefined', async () => {
    // Arrange
    const ctx = generateCtx({});
    const mockFile = { id: '123', name: 'testFile' };
    const mockData = { source: 'testSource', name: 'testName' };
    const settings = { providerName: null };

    findOne.mockResolvedValue(settings);
    dataForReturnFile.mockResolvedValue(mockData);

    // Act
    await duplicate({ file: mockFile, ctx });

    // Assert
    expect(dataForReturnFile).toHaveBeenCalledWith({ id: mockFile.id, ctx });
    expect(uploadFromSource).toHaveBeenCalledWith({
      source: mockData,
      name: mockFile.name,
      ctx,
    });
  });
});
