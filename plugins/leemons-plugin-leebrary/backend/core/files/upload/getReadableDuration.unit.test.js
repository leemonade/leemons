const { expect, it } = require('@jest/globals');
const { getReadableDuration } = require('./getReadableDuration');

it('should return duration in MM:SS format when duration is less than an hour', () => {
  // Arrange
  const duration = 1500000; // 25 minutes
  const padStart = true;

  // Act
  const result = getReadableDuration({ duration, padStart });

  // Assert
  expect(result).toBe('25:00');
});

it('should return duration in HH:MM:SS format when duration is more than an hour', () => {
  // Arrange
  const duration = 7200000; // 2 hours
  const padStart = true;

  // Act
  const result = getReadableDuration({ duration, padStart });

  // Assert
  expect(result).toBe('02:00:00');
});

it('should not pad hours with leading zeros when padStart is false', () => {
  // Arrange
  const duration = 7200000; // 2 hours
  const padStart = false;

  // Act
  const result = getReadableDuration({ duration, padStart });

  // Assert
  expect(result).toBe('2:00:00');
});
