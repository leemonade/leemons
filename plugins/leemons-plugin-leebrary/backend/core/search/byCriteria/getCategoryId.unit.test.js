const { it, expect, beforeAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getCategoryId } = require('./getCategoryId');

const getCategory = require('../../../__fixtures__/getCategory');

jest.mock('../../categories/getById');
const { getById: getCategoryById } = require('../../categories/getById');

jest.mock('../../categories/getByKey');
const { getByKey: getCategoryByKey } = require('../../categories/getByKey');

describe('getCategoryId', () => {
  let ctx;

  beforeAll(async () => {
    ctx = generateCtx({});
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  describe('Intended workload', () => {
    it('should return category id by LRN', async () => {
      // Arrange
      const category = getCategory().categoryObject;
      getCategoryById.mockResolvedValue(category);
      // Act
      const result = await getCategoryId({ category: category.id, ctx });
      // Assert
      expect(getCategoryById).toBeCalledWith({ id: category.id, columns: ['id'], ctx });
      expect(getCategoryByKey).toBeCalledTimes(0);
      expect(result).toEqual(category.id);
    });

    it('should return category id by key', async () => {
      // Arrange
      const category = getCategory().categoryObject;
      getCategoryByKey.mockResolvedValue(category);
      // Act
      const result = await getCategoryId({ category: category.key, ctx });
      // Assert
      expect(getCategoryByKey).toBeCalledWith({ key: category.key, columns: ['id'], ctx });
      expect(getCategoryById).toBeCalledTimes(0);
      expect(result).toEqual(category.id);
    });
  });

  describe('Limit use cases', () => {
    it('should return undefined if category is not provided', async () => {
      // Arrange
      const category = undefined;
      // Act
      const result = await getCategoryId({ category, ctx });
      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should return Error if category is not found', async () => {
      // Arrange
      const category = 'nonexistent';
      getCategoryById.mockResolvedValue(null);
      getCategoryByKey.mockResolvedValue(null);
      // Act
      const testFunc = async () => getCategoryId({ category, ctx });
      // Assert
      await expect(testFunc).rejects.toThrow();
    });
  });
});
