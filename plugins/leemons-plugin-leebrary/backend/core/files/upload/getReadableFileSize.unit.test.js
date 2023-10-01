const { expect, it } = require('@jest/globals');
const { getReadableFileSize } = require('./getReadableFileSize');

it('should return size in bytes when size is less than 1024 bytes', () => {
  // Arrange
  const size = 500; // 500 bytes

  // Act
  const result = getReadableFileSize(size);

  // Assert
  expect(result).toBe('500 B');
});

it('should return size in KB when size is more than 1024 bytes but less than 1048576 bytes', () => {
  // Arrange
  const size = 1500;

  // Act
  const result = getReadableFileSize(size);

  // Assert
  expect(result).toBe('1.5 KB');
});

it('should return size in MB when size is more than 1048576 bytes but less than 1073741824 bytes', () => {
  // Arrange
  const size = 1500000;

  // Act
  const result = getReadableFileSize(size);

  // Assert
  expect(result).toBe('1.4 MB');
});

it('should return size in GB when size is more than 1073741824 bytes but less than 1099511627776 bytes', () => {
  // Arrange
  const size = 1500000000;

  // Act
  const result = getReadableFileSize(size);

  // Assert
  expect(result).toBe('1.4 GB');
});

it('should return 0 bytes when size is 0', () => {
  // Arrange & Act
  const result = getReadableFileSize(0);

  // Assert
  expect(result).toBe('0 B');
});
