const { it, expect } = require('@jest/globals');

const { isNonEmptyArray } = require('./isNonEmptyArray');

it('Should return true for not empty arrays', () => {
  // Arrange
  const value = [undefined];

  // Act
  const response = isNonEmptyArray(value);

  // Assert
  expect(response).toBe(true);
});

it('Should return false for empty arrays', () => {
  // Arrange
  const value = [];

  // Act
  const response = isNonEmptyArray(value);

  // Assert
  expect(response).toBe(false);
});

it('Should return false for any other values', () => {
  // Arrange
  const value = 'hello world';
  const valueTwo = { test: 'hello world' };

  // Act
  const response = isNonEmptyArray(value);
  const responseTwo = isNonEmptyArray(valueTwo);

  // Assert
  expect(response).toBe(false);
  expect(responseTwo).toBe(false);
});
