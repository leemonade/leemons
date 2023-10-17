const { it, expect } = require('@jest/globals');

const { buildQuery } = require('./buildQuery');

it('should return a query with only id when indexable is falsy', () => {
  // Arrange
  const assetsIds = ['1', '2', '3'];
  const indexable = undefined;

  // Act
  const result = buildQuery({ assetsIds, indexable });

  // Assert
  expect(result).toEqual({ id: assetsIds });
});

it('should return a query with id and indexable when indexable is true', () => {
  // Arrange
  const assetsIds = ['1', '2', '3'];
  const indexable = true;

  // Act
  const result = buildQuery({ assetsIds, indexable });

  // Assert
  expect(result).toEqual({ id: assetsIds, indexable });
});
