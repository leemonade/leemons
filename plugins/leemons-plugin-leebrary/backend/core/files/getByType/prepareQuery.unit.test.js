const { it, expect } = require('@jest/globals');
const { prepareQuery } = require('./prepareQuery');

it('should return an empty object when no parameters are provided', () => {
  // Arrange
  const type = undefined;
  const files = undefined;

  // Act
  const result = prepareQuery(type, files);

  // Assert
  expect(result).toEqual({});
});

it('should return a query object with id when files parameter is provided', () => {
  // Arrange
  const type = undefined;
  const files = ['file1', 'file2'];

  // Act
  const result = prepareQuery(type, files);

  // Assert
  expect(result).toEqual({ id: files });
});

it('should return a query object with type when type parameter is provided', () => {
  // Arrange
  const type = 'pdf';
  const files = undefined;

  // Act
  const result = prepareQuery(type, files);

  // Assert
  expect(result).toEqual({ type: { $regex: 'pdf', $options: 'i' } });
});

it('should return a query object with id and type when both parameters are provided', () => {
  // Arrange
  const type = 'document';
  const file = 'file1';

  // Act
  const result = prepareQuery(type, file);

  // Assert
  expect(result).toEqual({ id: [file], type: { $regex: 'application', $options: 'i' } });
});
