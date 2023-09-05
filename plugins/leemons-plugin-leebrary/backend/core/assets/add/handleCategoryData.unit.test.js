const { it, expect, afterEach } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handleCategoryData } = require('./handleCategoryData');
const getCategory = require('../../../__fixtures__/getCategory');

// Mocks
jest.mock('../../categories/getById');
jest.mock('../../categories/getByKey');
const { getById: getCategoryById } = require('../../categories/getById');
const { getByKey: getCategoryByKey } = require('../../categories/getByKey');

afterEach(() => jest.resetAllMocks());

it('Should return a category Object by correctly calling inner functions or return it unaffected when passed.', async () => {
  // Arrange
  const { categoryObject, categoryId, bookmarkKey } = getCategory();
  getCategoryById.mockResolvedValue({ ...categoryObject });
  getCategoryByKey.mockResolvedValue({ ...categoryObject });

  const ctx = generateCtx({});
  const expectedValue = { ...categoryObject };

  // Act
  const response = await handleCategoryData({
    category: { ...categoryObject },
    categoryId,
    categoryKey: bookmarkKey,
    ctx,
  });
  const responseWithCategoryId = await handleCategoryData({
    category: {},
    categoryId,
    categoryKey: bookmarkKey,
    ctx,
  });

  const responseWithCategoryKey = await handleCategoryData({
    category: undefined,
    categoryId: undefined,
    categoryKey: bookmarkKey,
    ctx,
  });
  const responseWithIdString = await handleCategoryData({
    category: categoryId,
    categoryId: undefined,
    categoryKey: undefined,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(responseWithCategoryId).toEqual(expectedValue);
  expect(getCategoryById).nthCalledWith(1, expect.objectContaining({ id: categoryId, ctx }));
  expect(responseWithCategoryKey).toEqual(expectedValue);
  expect(getCategoryByKey).nthCalledWith(1, expect.objectContaining({ id: bookmarkKey, ctx }));
  expect(responseWithIdString).toEqual(expectedValue);
  expect(getCategoryById).nthCalledWith(2, expect.objectContaining({ id: categoryId, ctx }));
});

it('Should survive', async () => {
  // Arrange
  const ctx = generateCtx({});
  const notStandardUUID = '550e8400e29b41d4a716446655440000';

  // Act
  await handleCategoryData({
    category: notStandardUUID,
    categoryId: undefined,
    categoryKey: undefined,
    ctx,
  });

  // Assert
  expect(getCategoryById).not.toHaveBeenCalled();
  expect(getCategoryByKey).toHaveBeenCalledWith({ id: notStandardUUID, ctx });
});
