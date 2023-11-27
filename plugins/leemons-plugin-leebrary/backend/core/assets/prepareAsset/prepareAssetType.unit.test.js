const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { prepareAssetType } = require('./prepareAssetType');

it('Should call prepareAssetType correctly', () => {
  // Arrange
  const fileTypes = ['xml', 'document', 'pdf'];
  const toCapitalize = false;
  const expectedValue = 'document';

  // Act & Assert
  fileTypes.forEach((fileType) => {
    expect(prepareAssetType(fileType, toCapitalize)).toBe(expectedValue);
  });
  expect(prepareAssetType('image/png', toCapitalize)).toBe('image');
  expect(prepareAssetType('image/png')).toBe('Image');
  expect(prepareAssetType()).toBe('');
});
