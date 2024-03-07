const { it, expect } = require('@jest/globals');
const { pad } = require('./pad');

it('should pad single digit numbers with a leading zero', () => {
  // Arrange
  const num = 5;

  // Act
  const result = pad(num);

  // Assert
  expect(result).toBe('05');
});

it('should not pad double digit numbers', () => {
  // Arrange
  const num = 10;

  // Act
  const result = pad(num);

  // Assert
  expect(result).toBe('10');
});

it('should return "00" when the input is 0', () => {
  // Arrange
  const num = 0;

  // Act
  const result = pad(num);

  // Assert
  expect(result).toBe('00');
});
