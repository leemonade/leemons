const { it, expect } = require('@jest/globals');
const { parseMetadata } = require('./parseMetadata');

it('should parse metadata when metadata is a valid JSON string', () => {
  // Arrange
  const item = { metadata: '{"key": "value"}' };

  // Act
  const result = parseMetadata(item);

  // Assert
  expect(result).toEqual({ metadata: { key: 'value' } });
});

it('should throw when metadata is not a valid JSON string', () => {
  // Arrange
  const item = { metadata: 'invalid JSON string' };

  // Act
  const testFnToThrowResult = () => parseMetadata(item);

  // Assert
  expect(testFnToThrowResult).toThrow();
});

it('should not parse metadata when metadata is not a string', () => {
  // Arrange
  const item = { metadata: 12345 };

  // Act
  const result = parseMetadata(item);

  // Assert
  expect(result).toEqual({ metadata: 12345 });
});

it('should return the item as is when metadata is not present', () => {
  // Arrange
  const item = { key: 'value' };

  // Act
  const result = parseMetadata(item);

  // Assert
  expect(result).toEqual({ key: 'value' });
});
