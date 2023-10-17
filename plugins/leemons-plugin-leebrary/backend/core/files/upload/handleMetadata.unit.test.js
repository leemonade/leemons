const { it, expect } = require('@jest/globals');

const { handleMetadata } = require('./handleMetadata');
const { getReadableFileSize } = require('./getReadableFileSize');

it('should return metadata and file size when file size is not zero', async () => {
  // Arrange
  const mockFileHandle = {
    stat: jest.fn().mockResolvedValue({ size: 1000 }),
  };
  const path = 'testPath';

  // Act
  const result = await handleMetadata({ fileHandle: mockFileHandle, path });

  // Assert
  expect(result).toEqual({ metadata: { size: getReadableFileSize(1000) }, fileSize: 1000 });
  expect(mockFileHandle.stat).toHaveBeenCalledWith(path);
});

it('should return empty metadata and file size when file size is zero', async () => {
  // Arrange
  const mockFileHandle = {
    stat: jest.fn().mockResolvedValue({ size: 0 }),
  };
  const path = 'testPath';

  // Act
  const result = await handleMetadata({ fileHandle: mockFileHandle, path });

  // Assert
  expect(result).toEqual({ metadata: {}, fileSize: 0 });
  expect(mockFileHandle.stat).toHaveBeenCalledWith(path);
});

it('should throw an error when fileHandle.stat fails', async () => {
  // Arrange
  const mockFileHandle = {
    stat: jest.fn().mockRejectedValue(new Error('stat error')),
  };
  const path = 'testPath';

  // Act and Assert
  await expect(handleMetadata({ fileHandle: mockFileHandle, path })).rejects.toThrow('stat error');
  expect(mockFileHandle.stat).toHaveBeenCalledWith(path);
});
