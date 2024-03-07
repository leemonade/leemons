const { it, expect, describe } = require('@jest/globals');
const mime = require('mime-types');
const { handleCommonFileDetails } = require('./handleCommonFileDetails');

describe('handleCommonFileDetails', () => {
  it('should return correct file details when path is provided', () => {
    // Arrange
    const file = { name: 'test', extension: 'txt', type: 'text/plain' };
    const path = '/path/to/test.txt';

    // Act
    const result = handleCommonFileDetails({ file, path });

    // Assert
    expect(result).toEqual({
      file,
      contentType: mime.lookup('txt'),
      fileName: 'test.txt',
    });
  });

  it('should return correct file details when path is not provided', () => {
    // Arrange
    const file = { name: 'test', extension: 'txt', type: 'text/plain' };

    // Act
    const result = handleCommonFileDetails({ file });

    // Assert
    expect(result).toEqual({
      file,
      contentType: file.type,
      fileName: `${file.name}.${file.extension}`,
    });
  });

  it('should return correct file details when file type is not known', () => {
    // Act
    const file = { name: 'test', extension: 'unknown', type: 'application/octet-stream' };
    const path = '/path/to/test.unknown';

    // Act
    const result = handleCommonFileDetails({ file, path });

    // Assert
    expect(result).toEqual({
      file,
      contentType: mime.lookup('unknown'),
      fileName: 'test.unknown',
    });
  });
});
