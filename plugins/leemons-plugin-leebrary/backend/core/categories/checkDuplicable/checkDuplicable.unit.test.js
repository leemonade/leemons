const { beforeAll, describe, it, expect } = require('@jest/globals');
const { LeemonsError } = require('@leemons/error');
const { generateCtx } = require('@leemons/testing');

const { checkDuplicable } = require('./checkDuplicable');
const getCategory = require('../../../__fixtures__/getCategory');

jest.mock('../getById');
const { getById } = require('../getById');

describe('checkDuplicable', () => {
  let ctx;

  beforeAll(() => {
    ctx = generateCtx({});
  });

  it('should return the category when it is duplicable', async () => {
    // Arrange
    const categoryData = getCategory().categoryObject;
    getById.mockResolvedValue(categoryData);

    // Act
    const result = await checkDuplicable({ categoryId: categoryData.id, ctx });

    // Assert
    expect(result.id).toEqual(categoryData.id);
  });

  it('should throw a LeemonsError when category is not duplicable', async () => {
    // Arrange
    const categoryData = { ...getCategory().categoryObject, duplicable: false };
    getById.mockResolvedValue(categoryData);

    // Act and Assert
    await expect(checkDuplicable({ categoryId: categoryData.id, ctx })).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Assets in this category cannot be duplicated',
        httpStatusCode: 401,
      })
    );
  });
});
