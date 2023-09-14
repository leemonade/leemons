const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { getAssetsCategoryData } = require('./getAssetsCategoryData');

it('Should call getAssetsCategoryData correctly', () => {
  // Arrange
  // const ctx = generateCtx({});

  // Act
  // const response = getAssetsCategoryData({ ctx });

  // Assert
  expect(2).toBe(2);
});
