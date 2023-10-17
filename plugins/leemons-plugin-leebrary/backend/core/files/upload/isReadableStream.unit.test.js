const { expect, it } = require('@jest/globals');
const stream = require('stream');
const { isReadableStream } = require('./isReadableStream');

it('should return true for a readable stream', () => {
  // Arrange
  const readable = new stream.Readable();

  // Act
  const result = isReadableStream(readable);

  // Assert
  expect(result).toBe(true);
});

it('should return false for a non-readable stream', () => {
  // Arrange
  const nonReadable = {};

  // Act
  const result = isReadableStream(nonReadable);

  // Assert
  expect(result).toBe(false);
});

it('should return false for a non-stream object', () => {
  // Arrange
  const nonStream = new Date();

  // Act
  const result = isReadableStream(nonStream);

  // Assert
  expect(result).toBe(false);
});
