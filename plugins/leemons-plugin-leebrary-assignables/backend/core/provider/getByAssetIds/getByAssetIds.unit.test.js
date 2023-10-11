const { it, expect, describe } = require('@jest/globals');
const { getByAssetIds } = require('./getByAssetIds');

describe('Find Assignables By Asset Ids', () => {
  it('should return an array of assignables when valid assetIds are provided', async () => {
    // Arrange
    const assetIds = ['asset1', 'asset2'];
    const ctx = {
      tx: {
        call: jest.fn().mockResolvedValue([{ id: 'asset1' }, { id: 'asset2' }]),
      },
    };

    // Act
    const result = await getByAssetIds({ assetIds, ctx });

    // Assert
    expect(result).toEqual([{ id: 'asset1' }, { id: 'asset2' }]);
    expect(ctx.tx.call).toHaveBeenCalledWith('assignables.assignables.findAssignableByAssetIds', {
      assetIds,
    });
  });
});
