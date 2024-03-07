const _ = require('lodash');
const { it, expect, beforeEach } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { findAssignableByAssetIds } = require('./findAssignableByAssetIds');
const { getAssignables } = require('../getAssignables');

// Mocking the getAssignables function
jest.mock('../getAssignables', () => ({
  getAssignables: jest.fn(),
}));

describe('findAssignableByAssetIds', () => {
  beforeEach(() => {
    getAssignables.mockReset();
  });

  it('should return assignables for given asset ids', async () => {
    // Arrange
    const assets = [{ id: 'asset1' }, { id: 'asset2' }];
    const deleted = false;
    const ctx = generateCtx({});
    const expectedAssignables = [
      { id: 'assignable1', asset: 'asset1' },
      { id: 'assignable2', asset: 'asset2' },
    ];
    getAssignables.mockResolvedValue(expectedAssignables);

    // Act
    const result = await findAssignableByAssetIds({ assets, deleted, ctx });

    // Assert
    expect(getAssignables).toHaveBeenCalledWith({
      ids: assets,
      columns: [],
      showDeleted: deleted,
      throwOnMissing: false,
      ctx,
    });
    expect(result).toEqual(expectedAssignables);
  });
});
