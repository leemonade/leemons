const { it, expect } = require('@jest/globals');

const { applyOffsetAndLimit } = require('./applyOffsetAndLimit');

it('Should apply offset correctly', () => {
  // Arrange
  const result = ['item1', 'item2', 'item3', 'item4'];
  const filters = { offset: 2 };
  const expectedValue = ['item3', 'item4'];

  // Act
  const response = applyOffsetAndLimit(result, filters);

  // Assert
  expect(response.items).toEqual(expectedValue);
});

it('Should apply limit correctly', () => {
  // Arrange
  const result = ['item1', 'item2', 'item3', 'item4'];
  const filters = { limit: 2 };
  const expectedValue = ['item1', 'item2'];

  // Act
  const response = applyOffsetAndLimit(result, filters);

  // Assert
  expect(response.items).toEqual(expectedValue);
});

it('Should apply both offset and limit correctly', () => {
  // Arrange
  const result = ['item1', 'item2', 'item3', 'item4'];
  const filters = { offset: 1, limit: 2 };
  const expectedValue = ['item2', 'item3'];

  // Act
  const response = applyOffsetAndLimit(result, filters);

  // Assert
  expect(response.items).toEqual(expectedValue);
});
