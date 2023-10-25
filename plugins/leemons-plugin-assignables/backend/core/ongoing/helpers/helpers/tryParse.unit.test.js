const { it, expect } = require('@jest/globals');
const { tryParse } = require('./tryParse');

it('Should return parsed JSON for valid JSON strings', () => {
  // Arrange
  const value = '{"test": "hello world"}';

  // Act
  const response = tryParse(value);

  // Assert
  expect(response).toEqual({ test: 'hello world' });
});

it('Should return the original value for invalid JSON strings', () => {
  // Arrange
  const value = 'foo';

  // Act
  const response = tryParse(value);

  // Assert
  expect(response).toBe('foo');
});
