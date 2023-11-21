const { it, expect, describe } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getByAssetIds } = require('./getByAssetIds');

jest.mock('../../assignables/findAssignableByAssetIds');
const { findAssignableByAssetIds } = require('../../assignables/findAssignableByAssetIds');

describe('Find Assignables By Asset Ids', () => {
  it('should return an array of assignables when valid assetIds are provided', async () => {
    // Arrange
    const assetIds = ['asset1', 'asset2'];
    const ctx = generateCtx({});
    findAssignableByAssetIds.mockReturnValue([{ id: 'asset1' }, { id: 'asset2' }]);

    // Act
    const result = await getByAssetIds({ assetIds, ctx });

    // Assert
    expect(result).toEqual([{ id: 'asset1' }, { id: 'asset2' }]);
    expect(findAssignableByAssetIds).toHaveBeenCalledWith({
      assets: assetIds,
      ctx,
    });
  });
});
