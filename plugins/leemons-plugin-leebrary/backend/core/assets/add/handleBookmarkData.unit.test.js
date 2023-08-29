const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handleBookmarkData } = require('./handleBookmarkData');

it('Should call handleBookmarkData correctly', () => {
  // Arrange
  const expectedValue = 'initial values';

  const ctx = generateCtx({});

  // Act
  const response = handleBookmarkData({ ctx });

  // Assert
  expect(response).toBe(expectedValue);
});
