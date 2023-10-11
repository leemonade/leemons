const { it, expect } = require('@jest/globals');

const getAssetUpdateDataInput = require('../../../__fixtures__/getAssetUpdateDataInput');
const { CATEGORIES } = require('../../../config/constants');

const { prepareAssetData } = require('./prepareAssetData');

const { initialData: asset } = getAssetUpdateDataInput();

const expectedSubject = [
  { subject: '16a7190b-7c9b-475a-82fe-d78b5a54ebf1', level: 'lowerIntermediate' },
];

it('Should call prepareAssetData correctly if categoryKey is setted', () => {
  // Arrange
  const data = asset;
  // Act
  const response = prepareAssetData({ data });

  // Assert
  expect(response.subjects).toStrictEqual(expectedSubject);
  expect(response.categoryKey).toBe(CATEGORIES.MEDIA_FILES);
});

it('Should call prepareAssetData correctly if categoryKey is unsetted', () => {
  // Arrange

  const data = { ...asset, categoryKey: undefined };

  // Act
  const response = prepareAssetData({ data });

  // Assert
  expect(response.subjects).toStrictEqual(expectedSubject);
  expect(response.categoryKey).toBe(CATEGORIES.MEDIA_FILES);
});

it('Should call prepareAssetData correctly if data.subjects is not an array', () => {
  // Arrange
  const data = { ...asset, subjects: 'not an array' };

  // Act
  const response = prepareAssetData({ data });

  // Assert
  expect(response.subjects).toBe(data.subjects);
});
