const { expect, it } = require('@jest/globals');
const { getMetaProps } = require('./getMetaProps');

it('should return an empty object when data is empty', () => {
  // Arrange
  const data = {};
  // Act
  const result = getMetaProps({ data });
  // Assert
  expect(result).toEqual({});
});

it('should return an object with admitted metadata when data contains admitted metadata', () => {
  // Arrange
  const data = { format: 'pdf', duration: '2 hours', words: 2000 };
  // Act
  const result = getMetaProps({ data });
  // Assert
  expect(result).toEqual({ format: 'pdf', duration: '2 hours', words: 2000 });
});

it('should not overwrite existing metadata in the result object', () => {
  // Arrange
  const data = { format: 'pdf' };
  // Act
  const result = { format: 'docx' };
  // Assert
  const finalResult = getMetaProps({ data, result });
  expect(finalResult).toEqual({ format: 'docx' });
});

it('should ignore metadata not included in the ADMITTED_METADATA array', () => {
  // Arrange
  const data = { format: 'pdf', irrelevantKey: 'irrelevantValue' };
  // Act
  const result = getMetaProps({ data });
  // Assert
  expect(result).toEqual({ format: 'pdf' });
});
